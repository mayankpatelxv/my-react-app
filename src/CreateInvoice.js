import { useState } from "react";
import "./CreateInvoice.css";

const CreateInvoice = ({ user, onLogout, onNavigate }) => {
  const [selectedCustomer, setSelectedCustomer] = useState("Acme Corp");
  const [items, setItems] = useState([
    { id: 1, name: "Product A - Premium Widget", price: 50, quantity: 5 },
    { id: 2, name: "Service B - Consulting Hour", price: 120, quantity: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [confirmInventory, setConfirmInventory] = useState(false);

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
    "GlobalTech Solutions", 
    "Innovate Marketing",
    "Bright Future Academy"
  ];

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateItemDiscount = () => {
    return 5.00; // Fixed discount as shown in image
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * taxRate) / 100;
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const itemDiscount = calculateItemDiscount();
    const tax = calculateTax();
    return subtotal - itemDiscount + tax - additionalDiscount;
  };

  const updateItemQuantity = (id, quantity) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: parseInt(quantity) || 0 } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      price: 0,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="create-invoice-container">
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
              className="menu-item"
              onClick={() => onNavigate(item.name)}
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

        <div className="invoice-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Customer Selection */}
            <div className="section">
              <h2>Select Customer</h2>
              <div className="customer-select">
                <select 
                  value={selectedCustomer} 
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {customers.map(customer => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
                <button className="add-customer-btn">Add New Customer</button>
              </div>
            </div>

            {/* Item Details */}
            <div className="section">
              <h2>Item Details</h2>
              <div className="items-list">
                {items.map((item) => (
                  <div key={item.id} className="item-row">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${item.price}</span>
                    </div>
                    <div className="item-controls">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                        min="0"
                        className="quantity-input"
                      />
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="add-item-btn" onClick={addNewItem}>
                  <span className="add-icon">⊕</span>
                  Add Item
                </button>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="section">
              <h2>Invoice Details</h2>
              <div className="invoice-details">
                <div className="detail-row">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                
                <div className="detail-row">
                  <label>Additional Discount ($)</label>
                  <input
                    type="number"
                    value={additionalDiscount}
                    onChange={(e) => setAdditionalDiscount(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="confirmInventory"
                    checked={confirmInventory}
                    onChange={(e) => setConfirmInventory(e.target.checked)}
                  />
                  <label htmlFor="confirmInventory">
                    Confirm inventory update upon saving
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Invoice Summary */}
          <div className="right-column">
            <div className="invoice-summary">
              <h2>Invoice Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row discount">
                <span>Total Item Discount:</span>
                <span>-${calculateItemDiscount().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax ({taxRate}%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Grand Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
              
              <div className="action-buttons">
                <button className="save-btn">Save Invoice</button>
                <button className="print-btn">Print Invoice</button>
                <button className="download-btn">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;