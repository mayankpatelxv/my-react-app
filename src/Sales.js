import { useState } from "react";
import "./Sales.css";

const Sales = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Sales");
  const [selectedCustomer, setSelectedCustomer] = useState("Acme Corp");
  const [taxRate, setTaxRate] = useState(10);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [confirmInventoryUpdate, setConfirmInventoryUpdate] = useState(true);

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Product A - Premium Widget",
      price: 50,
      quantity: 5
    },
    {
      id: 2,
      name: "Service B - Consulting Hour",
      price: 120,
      quantity: 0
    }
  ]);

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const customers = [
    "Acme Corp",
    "Tech Solutions Ltd",
    "Global Industries",
    "Innovation Hub",
    "Digital Dynamics"
  ];

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
    const newItem = {
      id: Date.now(),
      name: "New Item",
      price: 0,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const handleSaveInvoice = () => {
    console.log("Saving invoice...", {
      customer: selectedCustomer,
      items,
      taxRate,
      additionalDiscount,
      total: calculateGrandTotal()
    });
    alert("Invoice saved successfully!");
  };

  const handlePrintInvoice = () => {
    console.log("Printing invoice...");
    alert("Invoice sent to printer!");
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
    alert("PDF downloaded successfully!");
  };

  return (
    <div className="sales-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">
            <span>&lt;/&gt;</span>
          </div>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${activeMenu === item.name ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.name);
                if (item.name !== "Sales") {
                  onNavigate(item.name);
                }
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="menu-item" onClick={() => {}}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Settings</span>
          </div>
          <div className="menu-item logout" onClick={onLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
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
            <button className="notification-btn">🔔</button>
            <div className="user-menu">
              <button className="user-avatar" onClick={onLogout}>
                👤
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="invoice-content">
          <div className="invoice-left">
            {/* Customer Selection */}
            <div className="section customer-section">
              <h2>Select Customer</h2>
              <div className="customer-select-container">
                <select 
                  value={selectedCustomer} 
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="customer-select"
                >
                  {customers.map(customer => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
                <button className="add-customer-btn">Add New Customer</button>
              </div>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="item-name">{item.name}</td>
                        <td className="item-price">${item.price}</td>
                        <td className="item-quantity">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            min="0"
                            className="quantity-input"
                          />
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
                <button className="add-item-btn" onClick={handleAddItem}>
                  <span className="add-icon">➕</span>
                  Add Item
                </button>
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
                  <span className="summary-value">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row discount">
                  <span className="summary-label">Total Item Discount:</span>
                  <span className="summary-value">-${calculateDiscount().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Tax ({taxRate}%):</span>
                  <span className="summary-value">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span className="summary-label">Grand Total:</span>
                  <span className="summary-value">${calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="action-buttons">
                <button className="save-invoice-btn" onClick={handleSaveInvoice}>
                  Save Invoice
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
        </div>
      </div>
    </div>
  );
};

export default Sales;