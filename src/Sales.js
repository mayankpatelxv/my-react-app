import { useState, useEffect } from "react";
import "./Sales.css";
import { getItems, getParties, createSaleWithItems } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import UserMenu from "./UserMenu";
import jsPDF from 'jspdf';

const Sales = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
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
      alert("No items available. Please add items in Item Management first.");
      return;
    }
    
    // Add first available item that's not already in the list
    const availableItem = availableItems.find(item => 
      !items.some(selectedItem => selectedItem.itemId === item.id)
    );
    
    if (!availableItem) {
      alert("All available items have been added to the invoice.");
      return;
    }
    
    const newItem = {
      id: Date.now(), // Temporary ID for the UI
      itemId: availableItem.id, // Reference to the actual item
      name: availableItem.name,
      price: availableItem.price,
      quantity: 1,
      description: availableItem.description
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
      alert("Please select a customer.");
      return;
    }
    
    if (items.length === 0) {
      alert("Please add at least one item to the invoice.");
      return;
    }
    
    if (items.some(item => item.quantity <= 0)) {
      alert("All items must have a quantity greater than 0.");
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
        notes: null
      };

      const result = await createSaleWithItems(saleData, items, user.id);
      
      if (result.success) {
        alert(`Invoice saved successfully! Invoice #${result.data.sale.invoice_number}`);
        
        // Reset form
        setItems([]);
        setAdditionalDiscount(0);
        setTaxRate(10);
        
        // Optionally navigate to a sales list or dashboard
        // onNavigate("Dashboard");
      } else {
        alert("Failed to save invoice: " + result.error);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }
    
    if (items.length === 0) {
      alert("Please add at least one item to print invoice.");
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
        doc.text(`$${item.price.toFixed(2)}`, 130, currentY + 2);
        doc.text(`$${lineTotal.toFixed(2)}`, 160, currentY + 2);
        
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
      doc.text(`$${subtotal.toFixed(2)}`, 160, totalsY);
      
      // Discount
      if (discount > 0) {
        doc.text("Discount:", 130, totalsY + 10);
        doc.text(`-$${discount.toFixed(2)}`, 160, totalsY + 10);
      }
      
      // Tax
      doc.text(`Tax (${taxRate}%):`, 130, totalsY + (discount > 0 ? 20 : 10));
      doc.text(`$${tax.toFixed(2)}`, 160, totalsY + (discount > 0 ? 20 : 10));
      
      // Grand Total
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      const totalY = totalsY + (discount > 0 ? 35 : 25);
      
      doc.setFillColor(102, 126, 234);
      doc.rect(125, totalY - 5, 65, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.text("Total:", 130, totalY + 2);
      doc.text(`$${grandTotal.toFixed(2)}`, 160, totalY + 2);
      
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
      alert("Failed to generate PDF for printing. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }
    
    if (items.length === 0) {
      alert("Please add at least one item to generate PDF.");
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
        doc.text(`$${item.price.toFixed(2)}`, 130, currentY + 2);
        doc.text(`$${lineTotal.toFixed(2)}`, 160, currentY + 2);
        
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
      doc.text(`$${subtotal.toFixed(2)}`, 160, totalsY);
      
      // Discount
      if (discount > 0) {
        doc.text("Discount:", 130, totalsY + 10);
        doc.text(`-$${discount.toFixed(2)}`, 160, totalsY + 10);
      }
      
      // Tax
      doc.text(`Tax (${taxRate}%):`, 130, totalsY + (discount > 0 ? 20 : 10));
      doc.text(`$${tax.toFixed(2)}`, 160, totalsY + (discount > 0 ? 20 : 10));
      
      // Grand Total
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "bold");
      const totalY = totalsY + (discount > 0 ? 35 : 25);
      
      doc.setFillColor(102, 126, 234);
      doc.rect(125, totalY - 5, 65, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.text("Total:", 130, totalY + 2);
      doc.text(`$${grandTotal.toFixed(2)}`, 160, totalY + 2);
      
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
      alert("Failed to generate PDF. Please try again.");
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
          <div className="header-left">
            <h1>Create New Invoice</h1>
          </div>
          <div className="header-actions">
            <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content">
          {loadingData ? (
            <div className="loading-container">
              <div className="loading-spinner">⏳</div>
              <p>Loading data...</p>
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
                                value={item.itemId || ''}
                                onChange={(e) => {
                                  const selectedItem = availableItems.find(ai => ai.id === parseInt(e.target.value));
                                  if (selectedItem) {
                                    handleItemChange(item.id, 'itemId', selectedItem.id);
                                    handleItemChange(item.id, 'name', selectedItem.name);
                                    handleItemChange(item.id, 'price', selectedItem.price);
                                    handleItemChange(item.id, 'description', selectedItem.description);
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
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => setAdditionalDiscount(parseFloat(e.target.value) || 0)}
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