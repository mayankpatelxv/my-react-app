import { useState, useEffect } from "react";
import "./Sales.css";
import { getItems, getParties, createSaleWithItems, updateItem } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import jsPDF from 'jspdf';
import LoadingSkeleton from "./LoadingSkeleton";
import { useToast } from "./Toast";
import { handleNumericKeyPress, handleIntegerKeyPress, validateNumericInput } from "./utils/validation";

const Sales = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
  const toast = useToast();
  const [activeMenu, setActiveMenu] = useState("Sales");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [taxRate, setTaxRate] = useState(10);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [confirmInventoryUpdate, setConfirmInventoryUpdate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data from database
  const [availableItems, setAvailableItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [items, setItems] = useState([]);

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoadingData(true);
    try {
      // Fetch items and parties in parallel
      const [itemsResult, partiesResult] = await Promise.all([
        getItems(user.id),
        getParties(user.id)
      ]);

      if (itemsResult.success) {
        setAvailableItems(itemsResult.data);
      } else {
        console.error("Failed to fetch items:", itemsResult.error);
      }

      if (partiesResult.success) {
        console.log("All parties fetched:", partiesResult.data);
        
        // Filter for customers only (matching the actual party_type values from AddParty)
        const customerList = partiesResult.data.filter(party => 
          party.party_type === 'Customer' || party.party_type === 'Both'
        );
        
        console.log("Filtered customer list:", customerList);
        setCustomers(customerList);
        
        // Set first customer as default if available
        if (customerList.length > 0) {
          setSelectedCustomer(customerList[0].name);
          setSelectedCustomerId(customerList[0].id);
        }
      } else {
        console.error("Failed to fetch parties:", partiesResult.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return additionalDiscount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * taxRate) / 100;
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(0, parseInt(newQuantity) || 0) }
        : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    if (availableItems.length === 0) {
      toast.warning("No items available. Please add items in Item Management first.");
      return;
    }
    
    // Add a blank row — user picks the item themselves
    const newItem = {
      id: Date.now(),
      itemId: null,
      name: "",
      price: 0,
      quantity: 1,
      description: ""
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (itemId, field, value) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleCustomerChange = (customerName) => {
    setSelectedCustomer(customerName);
    const customer = customers.find(c => c.name === customerName);
    setSelectedCustomerId(customer ? customer.id : null);
  };

  const handleSaveInvoice = async () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer.");
      return;
    }
    
    if (items.length === 0) {
      toast.warning("Please add at least one item to the invoice.");
      return;
    }
    
    if (items.some(item => item.quantity <= 0)) {
      toast.warning("All items must have a quantity greater than 0.");
      return;
    }

    if (items.some(item => !item.itemId)) {
      toast.warning("Please select an item for all rows.");
      return;
    }

    setIsSaving(true);
    
    try {
      const saleData = {
        customerName: selectedCustomer,
        customerId: selectedCustomerId,
        subtotal: calculateSubtotal(),
        taxRate: taxRate,
        taxAmount: calculateTax(),
        discountAmount: calculateDiscount(),
        totalAmount: calculateGrandTotal(),
        status: 'draft',
        paymentTerms: null,
        notes: null,
        invoiceDate: new Date().toISOString().split('T')[0]
      };

      const result = await createSaleWithItems(saleData, items, user.id);
      
      if (result.success) {
        const invoiceNum = result.data.sale.invoice_number;
        toast.success(`Invoice saved! Invoice #${invoiceNum}`);

        // Deduct stock for each sold item
        if (confirmInventoryUpdate) {
          for (const soldItem of items) {
            if (!soldItem.itemId) continue;
            const sourceItem = availableItems.find(ai => ai.id === soldItem.itemId);
            if (!sourceItem) continue;
            const newStock = Math.max(0, sourceItem.stock_level - soldItem.quantity);
            await updateItem(soldItem.itemId, {
              name: sourceItem.name,
              category: sourceItem.category,
              unit: sourceItem.unit,
              price: sourceItem.price,
              stockLevel: newStock,
              minStockLevel: sourceItem.min_stock_level,
              description: sourceItem.description,
              sku: sourceItem.sku,
              barcode: sourceItem.barcode,
              supplier: sourceItem.supplier,
              location: sourceItem.location,
              weight: sourceItem.weight,
              dimensions: sourceItem.dimensions,
              notes: sourceItem.notes,
            }, user.id);
          }
          // Refresh available items so stock shows updated values
          const refreshed = await getItems(user.id);
          if (refreshed.success) setAvailableItems(refreshed.data);
        }

        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Invoice Created", {
            body: `Invoice #${invoiceNum} for ${selectedCustomer} - ${formatCurrency(calculateGrandTotal())}`,
            icon: "/logo192.png"
          });
        }
        
        // Reset form
        setItems([]);
        setAdditionalDiscount(0);
        setTaxRate(10);
        
        // Optionally navigate to a sales list or dashboard
        // onNavigate("Dashboard");
      } else {
        toast.error("Failed to save invoice: " + result.error);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer first.");
      return;
    }
    
    if (items.length === 0) {
      toast.warning("Please add at least one item to print invoice.");
      return;
    }

    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font
      doc.setFont("helvetica");
      
      // Company Header
      doc.setFontSize(24);
      doc.setTextColor(102, 126, 234); // Brand color
      doc.text("bizBuddy", 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Business Management Solution", 20, 40);
      
      // Invoice Title
      doc.setFontSize(20);
      doc.setTextColor(31, 41, 55);
      doc.text("INVOICE", 150, 30);
      
      // Invoice Details
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const currentDate = new Date().toLocaleDateString();
      
      doc.text(`Invoice #: ${invoiceNumber}`, 150, 45);
      doc.text(`Date: ${currentDate}`, 150, 55);
      doc.text(`Due Date: ${currentDate}`, 150, 65);
      
      // Customer Information
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text("Bill To:", 20, 80);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(selectedCustomer, 20, 95);
      
      // Items Table Header
      const startY = 120;
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(102, 126, 234);
      doc.rect(20, startY, 170, 10, 'F');
      
      doc.text("Item", 25, startY + 7);
      doc.text("Qty", 110, startY + 7);
      doc.text("Price", 130, startY + 7);
      doc.text("Total", 160, startY + 7);
      
      // Items Table Content
      let currentY = startY + 15;
      doc.setTextColor(0, 0, 0);
      
      items.forEach((item, index) => {
        const lineTotal = item.price * item.quantity;
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(20, currentY - 5, 170, 10, 'F');
        }
        
        doc.text(item.name.substring(0, 35), 25, currentY + 2);
        doc.text(item.quantity.toString(), 110, currentY + 2);
        doc.text(formatCurrency(item.price), 130, currentY + 2);
        doc.text(formatCurrency(lineTotal), 160, currentY + 2);
        
        currentY += 12;
      });
      
      // Totals Section
      const totalsY = currentY + 10;
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const tax = calculateTax();
      const grandTotal = calculateGrandTotal();
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      
      // Subtotal
      doc.text("Subtotal:", 130, totalsY);
      doc.text(formatCurrency(subtotal), 160, totalsY);
      
      // Discount
      if (discount > 0) {
        doc.text("Discount:", 130, totalsY + 10);
        doc.text(`-${formatCurrency(discount)}`, 160, totalsY + 10);
      }
      
      // Tax
      doc.text(`Tax (${taxRate}%):`, 130, totalsY + (discount > 0 ? 20 : 10));
      doc.text(formatCurrency(tax), 160, totalsY + (discount > 0 ? 20 : 10));
      
      // Grand Total
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      const totalY = totalsY + (discount > 0 ? 35 : 25);
      
      doc.setFillColor(102, 126, 234);
      doc.rect(125, totalY - 5, 65, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.text("Total:", 130, totalY + 2);
      doc.text(formatCurrency(grandTotal), 160, totalY + 2);
      
      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text("Thank you for your business!", 20, 270);
      doc.text("Generated by bizBuddy - Business Management Solution", 20, 280);
      
      // Open PDF in new window for printing
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      
      // Trigger print dialog after PDF loads
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
      
    } catch (error) {
      console.error("Error generating PDF for printing:", error);
      toast.error("Failed to generate PDF for printing. Please try again.");
    }
  };

  const handleWhatsAppShare = () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer first.");
      return;
    }
    if (items.length === 0) {
      toast.warning("Please add at least one item to share.");
      return;
    }

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('en-IN');
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    const grandTotal = calculateGrandTotal();

    // Build items list
    const itemLines = items
      .map(item => `  • ${item.name} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
      .join("\n");

    // Build message
    let message = `*Invoice #${invoiceNumber}*\n`;
    message += `Date: ${currentDate}\n`;
    message += `Customer: ${selectedCustomer}\n\n`;
    message += `*Items:*\n${itemLines}\n\n`;
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    if (discount > 0) message += `Discount: -${formatCurrency(discount)}\n`;
    message += `Tax (${taxRate}%): ${formatCurrency(tax)}\n`;
    message += `*Total: ${formatCurrency(grandTotal)}*\n\n`;
    message += `_Thank you for your business!_\n— BizBuddy`;

    // Try to send directly to customer's phone if available
    const customer = customers.find(c => c.name === selectedCustomer);
    const phone = customer?.phone?.replace(/\D/g, ""); // strip non-digits

    const encodedMsg = encodeURIComponent(message);
    const url = phone
      ? `https://wa.me/${phone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(url, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleDownloadPDF = () => {
    if (!selectedCustomer) {
      toast.warning("Please select a customer first.");
      return;
    }
    
    if (items.length === 0) {
      toast.warning("Please add at least one item to generate PDF.");
      return;
    }

    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font
      doc.setFont("helvetica");
      
      // Company Header
      doc.setFontSize(24);
      doc.setTextColor(102, 126, 234); // Brand color
      doc.text("bizBuddy", 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Business Management Solution", 20, 40);
      
      // Invoice Title
      doc.setFontSize(20);
      doc.setTextColor(31, 41, 55);
      doc.text("INVOICE", 150, 30);
      
      // Invoice Details
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const currentDate = new Date().toLocaleDateString();
      
      doc.text(`Invoice #: ${invoiceNumber}`, 150, 45);
      doc.text(`Date: ${currentDate}`, 150, 55);
      doc.text(`Due Date: ${currentDate}`, 150, 65);
      
      // Customer Information
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text("Bill To:", 20, 80);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(selectedCustomer, 20, 95);
      
      // Items Table Header
      const startY = 120;
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(102, 126, 234);
      doc.rect(20, startY, 170, 10, 'F');
      
      doc.text("Item", 25, startY + 7);
      doc.text("Qty", 110, startY + 7);
      doc.text("Price", 130, startY + 7);
      doc.text("Total", 160, startY + 7);
      
      // Items Table Content
      let currentY = startY + 15;
      doc.setTextColor(0, 0, 0);
      
      items.forEach((item, index) => {
        const lineTotal = item.price * item.quantity;
        
        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(20, currentY - 5, 170, 10, 'F');
        }
        
        doc.text(item.name.substring(0, 35), 25, currentY + 2);
        doc.text(item.quantity.toString(), 110, currentY + 2);
        doc.text(formatCurrency(item.price), 130, currentY + 2);
        doc.text(formatCurrency(lineTotal), 160, currentY + 2);
        
        currentY += 12;
      });
      
      // Totals Section
      const totalsY = currentY + 10;
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount();
      const tax = calculateTax();
      const grandTotal = calculateGrandTotal();
      
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      
      // Subtotal
      doc.text("Subtotal:", 130, totalsY);
      doc.text(formatCurrency(subtotal), 160, totalsY);
      
      // Discount
      if (discount > 0) {
        doc.text("Discount:", 130, totalsY + 10);
        doc.text(`-${formatCurrency(discount)}`, 160, totalsY + 10);
      }
      
      // Tax
      doc.text(`Tax (${taxRate}%):`, 130, totalsY + (discount > 0 ? 20 : 10));
      doc.text(formatCurrency(tax), 160, totalsY + (discount > 0 ? 20 : 10));
      
      // Grand Total
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      const totalY = totalsY + (discount > 0 ? 35 : 25);
      
      doc.setFillColor(102, 126, 234);
      doc.rect(125, totalY - 5, 65, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.text("Total:", 130, totalY + 2);
      doc.text(formatCurrency(grandTotal), 160, totalY + 2);
      
      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text("Thank you for your business!", 20, 270);
      doc.text("Generated by bizBuddy - Business Management Solution", 20, 280);
      
      // Save the PDF
      const fileName = `Invoice_${invoiceNumber}_${selectedCustomer.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="sales-container">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <BizBuddyLogo size={44} />
          </div>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`menu-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.key);
                setIsMobileMenuOpen(false);
                if (item.key !== "Sales") {
                  onNavigate(item.key);
                }
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="menu-item" onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigate("Settings");
          }}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">{getText('settings')}</span>
          </div>
          <div className="menu-item logout" onClick={() => {
            setIsMobileMenuOpen(false);
            onLogout();
          }}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">{getText('logout')}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <button className="dashboard-btn" onClick={() => onNavigate("Dashboard")}>
            <span className="dashboard-icon">←</span>
            Back to Dashboard
          </button>
          <div className="header-left">
            <h1>Create New Invoice</h1>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content">
          {loadingData ? (
            <div className="loading-skeleton-container">
              <LoadingSkeleton type="form" />
            </div>
          ) : (
            <>
              <div className="invoice-left">
                {/* Customer Selection */}
                <div className="section customer-section">
                  <h2>Select Customer</h2>
                  <div className="customer-select-container">
                    <select 
                      value={selectedCustomer} 
                      onChange={(e) => handleCustomerChange(e.target.value)}
                      className="customer-select"
                      disabled={customers.length === 0}
                    >
                      <option value="">Select a customer...</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.name}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <button 
                      className="add-customer-btn"
                      onClick={() => onNavigate("Party Management")}
                    >
                      Add New Customer
                    </button>
                  </div>
                  {customers.length === 0 && (
                    <p className="no-data-message">
                      No customers found. Please add customers in Party Management first.
                    </p>
                  )}
                </div>

                {/* Item Details */}
                <div className="section items-section">
                  <h2>Item Details</h2>
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="item-name">
                              <select
                                value={item.itemId ? String(item.itemId) : ''}
                                onChange={(e) => {
                                  const selectedItem = availableItems.find(ai => ai.id === parseInt(e.target.value));
                                  if (selectedItem) {
                                    setItems(prev => prev.map(it =>
                                      it.id === item.id
                                        ? { ...it, itemId: selectedItem.id, name: selectedItem.name, price: selectedItem.price, description: selectedItem.description || '' }
                                        : it
                                    ));
                                  }
                                }}
                                className="item-select"
                              >
                                <option value="">Select item...</option>
                                {availableItems.map(availableItem => (
                                  <option key={availableItem.id} value={availableItem.id}>
                                    {availableItem.name} - ${availableItem.price}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="item-price">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                onKeyDown={handleNumericKeyPress}
                                min="0"
                                step="0.01"
                                className="price-input"
                              />
                            </td>
                            <td className="item-quantity">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                onKeyDown={handleIntegerKeyPress}
                                min="0"
                                className="quantity-input"
                              />
                            </td>
                            <td className="item-total">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                            <td className="item-actions">
                              <button 
                                className="remove-btn"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button 
                      className="add-item-btn" 
                      onClick={handleAddItem}
                      disabled={availableItems.length === 0}
                    >
                      <span className="add-icon">➕</span>
                      Add Item
                    </button>
                    {availableItems.length === 0 && (
                      <p className="no-data-message">
                        No items available. Please add items in Item Management first.
                      </p>
                    )}
                  </div>
                </div>

            {/* Invoice Details */}
            <div className="section invoice-details-section">
              <h2>Invoice Details</h2>
              <div className="invoice-details-grid">
                <div className="form-group">
                  <label htmlFor="taxRate">Tax Rate (%)</label>
                  <input
                    type="number"
                    id="taxRate"
                    value={taxRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setTaxRate(Math.min(100, Math.max(0, val)));
                    }}
                    onKeyDown={handleNumericKeyPress}
                    min="0"
                    max="100"
                    step="0.1"
                    className="tax-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="additionalDiscount">Additional Discount ($)</label>
                  <input
                    type="number"
                    id="additionalDiscount"
                    value={additionalDiscount}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setAdditionalDiscount(Math.max(0, val));
                    }}
                    onKeyDown={handleNumericKeyPress}
                    min="0"
                    step="0.01"
                    className="discount-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={confirmInventoryUpdate}
                      onChange={(e) => setConfirmInventoryUpdate(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Confirm inventory update upon saving</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="invoice-right">
            <div className="summary-section">
              <h2>Invoice Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="summary-row discount">
                  <span className="summary-label">Total Item Discount:</span>
                  <span className="summary-value">-{formatCurrency(calculateDiscount())}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax ({taxRate}%):</span>
                  <span className="summary-value">{formatCurrency(calculateTax())}</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Grand Total:</span>
                  <span className="summary-value">{formatCurrency(calculateGrandTotal())}</span>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  className="save-invoice-btn" 
                  onClick={handleSaveInvoice}
                  disabled={isSaving || items.length === 0 || !selectedCustomer}
                >
                  {isSaving ? (
                    <>
                      <span className="loading-spinner">⏳</span>
                      Saving...
                    </>
                  ) : (
                    "Save Invoice"
                  )}
                </button>
                <button className="print-invoice-btn" onClick={handlePrintInvoice}>
                  Print Invoice
                </button>
                <button className="download-pdf-btn" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
                <button className="whatsapp-share-btn" onClick={handleWhatsAppShare}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Share on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default Sales;