import { useState, useEffect } from "react";
import "./ItemManagement.css";
import { getItems, deleteItem } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";

const ItemManagement = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("Item Management");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" }
  ];

  useEffect(() => {
    fetchItems();
  }, [user]);

  const fetchItems = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await getItems(user.id);
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || "Failed to fetch items");
      }
    } catch (err) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

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
    // Navigate to edit item page (you can implement this later)
    // onNavigate("Edit Item", { itemId });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const result = await deleteItem(itemId, user.id);
      if (result.success) {
        // Remove item from local state
        setItems(items.filter(item => item.id !== itemId));
        alert("Item deleted successfully!");
      } else {
        alert("Error deleting item: " + result.error);
      }
    } catch (err) {
      alert("Error deleting item: " + err.message);
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div className="item-management-container">
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
                if (item.key !== "Item Management") {
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
            <h1>Item Management</h1>
          </div>
          <div className="header-actions">
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
          </div>
          <button className="add-item-btn" onClick={() => onNavigate("Add Item")}>
            <span className="add-icon">➕</span>
            Add Item
          </button>
        </div>

        {/* Available Items Section */}
        <div className="items-section">
          <h2>Available Items</h2>
          
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">⏳</div>
              <p>Loading items...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <p>{error}</p>
              <button onClick={fetchItems} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
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
                      <td className="price">{formatCurrency(item.price)}</td>
                      <td className="stock-level">
                        <span className={`stock-badge ${getStockStatus(item.stock_level)}`}>
                          {item.stock_level}
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
          )}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Items Found</h3>
              <p>
                {items.length === 0 
                  ? "You haven't added any items yet. Click 'Add Item' to get started!"
                  : "No items match your search criteria. Try adjusting your search or add new items."
                }
              </p>
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