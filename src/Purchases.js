import { useState } from "react";
import "./Purchases.css";

const Purchases = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Purchases");
  const [selectedSupplier, setSelectedSupplier] = useState("Global Tech Solutions");
  const [purchaseDate, setPurchaseDate] = useState("2025-12-30");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2025-001");
  const [attachedDocument, setAttachedDocument] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Laptop Pro X",
      quantity: 2,
      unitCost: 1200,
      total: 2400
    },
    {
      id: 2,
      name: "Wireless Keyboard",
      quantity: 1,
      unitCost: 75,
      total: 75
    },
    {
      id: 3,
      name: "Office Chair Deluxe",
      quantity: 3,
      unitCost: 250,
      total: 750
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

  const suppliers = [
    "Global Tech Solutions",
    "Office Supplies Inc",
    "Tech Hardware Ltd",
    "Business Equipment Co",
    "Digital Solutions Provider"
  ];

  const availableItems = [
    "Laptop Pro X",
    "Wireless Keyboard",
    "Office Chair Deluxe",
    "Desktop Monitor",
    "Printer Multifunction",
    "External Hard Drive",
    "Wireless Mouse",
    "Standing Desk",
    "Conference Phone",
    "Projector HD"
  ];

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const quantity = Math.max(0, parseInt(newQuantity) || 0);
        return {
          ...item,
          quantity,
          total: quantity * item.unitCost
        };
      }
      return item;
    }));
  };

  const handleUnitCostChange = (itemId, newUnitCost) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const unitCost = Math.max(0, parseFloat(newUnitCost) || 0);
        return {
          ...item,
          unitCost,
          total: item.quantity * unitCost
        };
      }
      return item;
    }));
  };

  const handleItemNameChange = (itemId, newName) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, name: newName } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      quantity: 1,
      unitCost: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleSavePurchase = () => {
    console.log("Saving purchase...", {
      supplier: selectedSupplier,
      purchaseDate,
      invoiceNumber,
      items,
      total: calculateGrandTotal()
    });
    alert("Purchase entry saved successfully!");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedDocument(file.name);
      console.log("File uploaded:", file.name);
    }
  };

  return (
    <div className="purchases-container">
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
                if (item.name !== "Purchases") {
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
            <h1>Purchases - Create Entry</h1>
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

        {/* Purchase Content */}
        <div className="purchase-content">
          {/* Purchase Details */}
          <div className="section purchase-details-section">
            <h2>Purchase Details</h2>
            <div className="purchase-details-grid">
              <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <select
                  id="supplier"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="supplier-select"
                >
                  {suppliers.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="invoiceNumber">Invoice / Bill No.</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="invoice-input"
                  placeholder="Enter invoice number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="attachDocument">Attach Document</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="attachDocument"
                    onChange={handleFileUpload}
                    className="file-input"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <label htmlFor="attachDocument" className="file-upload-btn">
                    📎 Choose File
                  </label>
                  {attachedDocument && (
                    <span className="file-name">{attachedDocument}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="section purchased-items-section">
            <div className="section-header">
              <h2>Purchased Items</h2>
              <button className="add-item-btn" onClick={handleAddItem}>
                <span className="add-icon">➕</span>
                Add Item
              </button>
            </div>

            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="item-name-cell">
                        <select
                          value={item.name}
                          onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                          className="item-select"
                        >
                          {availableItems.map(itemName => (
                            <option key={itemName} value={itemName}>{itemName}</option>
                          ))}
                        </select>
                      </td>
                      <td className="quantity-cell">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          min="0"
                          className="quantity-input"
                        />
                      </td>
                      <td className="unit-cost-cell">
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                          min="0"
                          step="0.01"
                          className="unit-cost-input"
                        />
                      </td>
                      <td className="total-cell">
                        <span className="total-amount">${item.total.toFixed(2)}</span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Remove Item"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="section summary-section">
            <h2>Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span className="summary-label">Total Items:</span>
                <span className="summary-value">{items.length}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Total Quantity:</span>
                <span className="summary-value">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Grand Total:</span>
                <span className="summary-value">${calculateGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="save-btn" onClick={handleSavePurchase}>
                Save Purchase Entry
              </button>
              <button className="cancel-btn" onClick={() => onNavigate("Dashboard")}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchases;