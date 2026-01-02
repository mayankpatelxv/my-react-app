import { useState } from "react";
import "./ItemManagement.css";

const ItemManagement = ({ user, onLogout, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("Item Management");

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const items = [
    {
      id: 1,
      name: "Wireless Ergonomic Mouse",
      category: "Electronics",
      unit: "Pcs",
      price: 29.99,
      stockLevel: 75
    },
    {
      id: 2,
      name: "Premium Ballpoint Pens (Blue, 12-pack)",
      category: "Stationery",
      unit: "Box",
      price: 12.50,
      stockLevel: 200
    },
    {
      id: 3,
      name: "A4 Photo Paper (Glossy, 100 sheets)",
      category: "Office Supplies",
      unit: "Pcs",
      price: 18.00,
      stockLevel: 45
    },
    {
      id: 4,
      name: "USB-C to HDMI Adapter",
      category: "Electronics",
      unit: "Pcs",
      price: 24.99,
      stockLevel: 8
    },
    {
      id: 5,
      name: "Desktop Organizer with Drawers",
      category: "Office Furniture",
      unit: "Pcs",
      price: 35.75,
      stockLevel: 15
    },
    {
      id: 6,
      name: "High-Speed External SSD 1TB",
      category: "Electronics",
      unit: "Pcs",
      price: 99.99,
      stockLevel: 60
    },
    {
      id: 7,
      name: "Organic Coffee Beans (500g)",
      category: "Pantry",
      unit: "Kg",
      price: 15.00,
      stockLevel: 25
    }
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stockLevel) => {
    if (stockLevel <= 10) return "low";
    if (stockLevel <= 50) return "medium";
    return "high";
  };

  const handleEdit = (itemId) => {
    console.log("Edit item:", itemId);
    // Future implementation
  };

  const handleDelete = (itemId) => {
    console.log("Delete item:", itemId);
    // Future implementation
  };

  return (
    <div className="item-management-container">
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
                if (item.name !== "Item Management") {
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
            <h1>Item Management</h1>
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

        {/* Search and Add Section */}
        <div className="controls-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-item-btn" onClick={() => onNavigate("Add Item")}>
            <span className="add-icon">➕</span>
            Add Item
          </button>
        </div>

        {/* Available Items Section */}
        <div className="items-section">
          <h2>Available Items</h2>
          
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Stock Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td className="category">{item.category}</td>
                    <td className="unit">{item.unit}</td>
                    <td className="price">${item.price}</td>
                    <td className="stock-level">
                      <span className={`stock-badge ${getStockStatus(item.stockLevel)}`}>
                        {item.stockLevel}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(item.id)}
                        title="Edit Item"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Item"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Items Found</h3>
              <p>No items match your search criteria. Try adjusting your search or add new items.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>© 2025 Smart Business Management. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;