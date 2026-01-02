import { useState } from "react";
import "./AddItem.css";

const AddItem = ({ user, onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    unit: "Pcs",
    price: "",
    stockLevel: "",
    minStockLevel: "",
    description: "",
    sku: "",
    barcode: "",
    supplier: "",
    location: "",
    weight: "",
    dimensions: "",
    notes: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const categories = [
    "Electronics",
    "Stationery",
    "Office Supplies",
    "Office Furniture",
    "Pantry",
    "Hardware",
    "Software",
    "Books",
    "Clothing",
    "Other"
  ];

  const units = [
    "Pcs",
    "Box",
    "Kg",
    "Lbs",
    "Meters",
    "Liters",
    "Dozen",
    "Pack",
    "Set",
    "Unit"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically save to your database
      console.log("Adding new item:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Item "${formData.name}" has been added successfully!`);
      
      // Reset form
      setFormData({
        name: "",
        category: "Electronics",
        unit: "Pcs",
        price: "",
        stockLevel: "",
        minStockLevel: "",
        description: "",
        sku: "",
        barcode: "",
        supplier: "",
        location: "",
        weight: "",
        dimensions: "",
        notes: ""
      });
      
    } catch (error) {
      alert("Error adding item: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate("Item Management");
  };

  return (
    <div className="add-item-container">
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
              className={`menu-item ${item.name === "Item Management" ? "active" : ""}`}
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
            <button className="back-btn" onClick={handleCancel}>
              ← Back to Item Management
            </button>
            <h1>Add New Item</h1>
            <p>Create a new inventory item for your business</p>
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

        {/* Form Content */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="item-form">
            {/* Basic Information */}
            <div className="form-section">
              <div className="section-header">
                <h2>Basic Information</h2>
                <span className="section-icon">📦</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="name">Item Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unit *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stockLevel">Current Stock Level *</label>
                  <input
                    type="number"
                    id="stockLevel"
                    name="stockLevel"
                    value={formData.stockLevel}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the item..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="form-section">
              <div className="section-header">
                <h2>Inventory Details</h2>
                <span className="section-icon">📊</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="sku">SKU/Product Code</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="SKU-001"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="barcode">Barcode</label>
                  <input
                    type="text"
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder="123456789012"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minStockLevel">Minimum Stock Level</label>
                  <input
                    type="number"
                    id="minStockLevel"
                    name="minStockLevel"
                    value={formData.minStockLevel}
                    onChange={handleInputChange}
                    placeholder="10"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="supplier">Supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Storage Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Warehouse A, Shelf 1"
                  />
                </div>
              </div>
            </div>

            {/* Physical Properties */}
            <div className="form-section">
              <div className="section-header">
                <h2>Physical Properties</h2>
                <span className="section-icon">📏</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.5"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dimensions">Dimensions (L×W×H)</label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="10×5×3 cm"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information about this item..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? "Adding Item..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;