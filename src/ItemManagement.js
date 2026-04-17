import { useState, useEffect } from "react";
import "./ItemManagement.css";
import { getItems, deleteItem, updateItem } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import LoadingSkeleton from "./LoadingSkeleton";
import CSVImport from "./CSVImport";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { validateNumericInput, handleNumericKeyPress, handleIntegerKeyPress } from "./utils/validation";

const ItemManagement = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText } = useSettings();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("Item Management");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "Electronics",
    unit: "Pcs",
    price: "",
    stockLevel: "",
    minStockLevel: "",
    description: ""
  });

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

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name || "",
      category: item.category || "Electronics",
      unit: item.unit || "Pcs",
      price: item.price || "",
      stockLevel: item.stock_level || "",
      minStockLevel: item.min_stock_level || "",
      description: item.description || ""
    });
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!editFormData.name.trim()) {
      toast.warning("Item name is required");
      return;
    }

    const priceValidation = validateNumericInput(editFormData.price, {
      min: 0,
      fieldName: "Price"
    });
    if (!priceValidation.isValid) {
      toast.warning(priceValidation.error);
      return;
    }

    const stockValidation = validateNumericInput(editFormData.stockLevel, {
      min: 0,
      allowDecimal: false,
      fieldName: "Stock Level"
    });
    if (!stockValidation.isValid) {
      toast.warning(stockValidation.error);
      return;
    }

    try {
      const result = await updateItem(editingItem.id, {
        name: editFormData.name,
        category: editFormData.category,
        unit: editFormData.unit,
        price: parseFloat(editFormData.price),
        stockLevel: parseInt(editFormData.stockLevel),
        minStockLevel: editFormData.minStockLevel ? parseInt(editFormData.minStockLevel) : 0,
        description: editFormData.description,
        sku: editingItem.sku,
        barcode: editingItem.barcode,
        supplier: editingItem.supplier,
        location: editingItem.location,
        weight: editingItem.weight,
        dimensions: editingItem.dimensions,
        notes: editingItem.notes
      }, user.id);
      
      if (result.success) {
        toast.success("Item updated successfully!");
        setEditingItem(null);
        fetchItems();
      } else {
        toast.error("Error updating item: " + result.error);
      }
    } catch (err) {
      toast.error("Error updating item: " + err.message);
      console.error("Error updating item:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      name: "",
      category: "Electronics",
      unit: "Pcs",
      price: "",
      stockLevel: "",
      minStockLevel: "",
      description: ""
    });
  };

  const handleDelete = async (itemId) => {
    const ok = await confirm({
      title: "Delete Item?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      const result = await deleteItem(itemId, user.id);
      if (result.success) {
        setItems(items.filter(item => item.id !== itemId));
        toast.success("Item deleted successfully!");
      } else {
        toast.error("Error deleting item: " + result.error);
      }
    } catch (err) {
      toast.error("Error deleting item: " + err.message);
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
          <button className="dashboard-btn" onClick={() => onNavigate("Dashboard")}>
            <span className="dashboard-icon">←</span>
            Back to Dashboard
          </button>
          <div className="header-left">
            <h1>Item Management</h1>
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
          <button className="csv-import-btn" onClick={() => setShowCSVImport(true)}>
            📥 Import CSV
          </button>
        </div>

        {/* Available Items Section */}
        <div className="items-section">
          <h2>Available Items</h2>
          
          {loading && (
            <div className="loading-skeleton-container">
              <LoadingSkeleton type="table" rows={5} columns={5} />
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
                          onClick={() => handleEdit(item)}
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

      {showCSVImport && (
        <CSVImport
          type="items"
          user={user}
          onClose={() => setShowCSVImport(false)}
          onSuccess={() => { setShowCSVImport(false); fetchItems(); }}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Item</h2>
              <button className="modal-close" onClick={handleCancelEdit}>×</button>
            </div>
            
            <form onSubmit={handleUpdateItem} className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">Item Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  required
                  placeholder="Enter item name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-category">Category *</label>
                <select
                  id="edit-category"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Office Furniture">Office Furniture</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Books">Books</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-unit">Unit *</label>
                <select
                  id="edit-unit"
                  value={editFormData.unit}
                  onChange={(e) => setEditFormData({...editFormData, unit: e.target.value})}
                  required
                >
                  <option value="Pcs">Pcs</option>
                  <option value="Box">Box</option>
                  <option value="Kg">Kg</option>
                  <option value="Lbs">Lbs</option>
                  <option value="Meters">Meters</option>
                  <option value="Liters">Liters</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Pack">Pack</option>
                  <option value="Set">Set</option>
                  <option value="Unit">Unit</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-price">Price *</label>
                <input
                  id="edit-price"
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  onKeyDown={handleNumericKeyPress}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-stock">Stock Level *</label>
                <input
                  id="edit-stock"
                  type="number"
                  value={editFormData.stockLevel}
                  onChange={(e) => setEditFormData({...editFormData, stockLevel: e.target.value})}
                  onKeyDown={handleIntegerKeyPress}
                  required
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-min-stock">Minimum Stock Level</label>
                <input
                  id="edit-min-stock"
                  type="number"
                  value={editFormData.minStockLevel}
                  onChange={(e) => setEditFormData({...editFormData, minStockLevel: e.target.value})}
                  onKeyDown={handleIntegerKeyPress}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Enter description"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManagement;