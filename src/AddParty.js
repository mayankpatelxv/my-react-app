import { useState } from "react";
import "./AddParty.css";

const AddParty = ({ user, onLogout, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    partyType: "Customer",
    taxId: "",
    creditLimit: "",
    paymentTerms: "Net 30",
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
      // Import the addParty function
      const { addParty } = await import('./supabaseClient');
      
      // Get user ID (you'll need to pass this from the parent component)
      const userId = user?.id || user?.user_id || user?.email; // Try different possible ID fields
      
      console.log("User object:", user);
      console.log("User ID being used:", userId);
      
      if (!userId) {
        alert("User not found. Please log in again.");
        setIsLoading(false);
        return;
      }
      
      const result = await addParty(formData, userId);
      
      if (result.success) {
        alert(`${formData.partyType} "${formData.name}" has been added successfully!`);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "United States",
          partyType: "Customer",
          taxId: "",
          creditLimit: "",
          paymentTerms: "Net 30",
          notes: ""
        });
        
        // Navigate back to Party Management
        onNavigate("Party Management");
      } else {
        alert("Error adding party: " + result.error);
      }
      
    } catch (error) {
      console.error("Error adding party:", error);
      alert("Error adding party: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onNavigate("Party Management");
  };

  return (
    <div className="add-party-container">
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
              className={`menu-item ${item.name === "Party Management" ? "active" : ""}`}
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
              ← Back to Party Management
            </button>
            <h1>Add New Party</h1>
            <p>Create a new customer or supplier profile</p>
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
          <form onSubmit={handleSubmit} className="party-form">
            {/* Basic Information */}
            <div className="form-section">
              <div className="section-header">
                <h2>Basic Information</h2>
                <span className="section-icon">👤</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="partyType">Party Type *</label>
                  <select
                    id="partyType"
                    name="partyType"
                    value={formData.partyType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Both">Both (Customer & Supplier)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="name">Company/Person Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter company or person name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@company.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <div className="section-header">
                <h2>Address Information</h2>
                <span className="section-icon">📍</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Business Street"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="form-section">
              <div className="section-header">
                <h2>Business Details</h2>
                <span className="section-icon">💼</span>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="taxId">Tax ID/VAT Number</label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="12-3456789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="creditLimit">Credit Limit ($)</label>
                  <input
                    type="number"
                    id="creditLimit"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleInputChange}
                    placeholder="10000"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="paymentTerms">Payment Terms</label>
                  <select
                    id="paymentTerms"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                  >
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information about this party..."
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
                {isLoading ? "Adding Party..." : "Add Party"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddParty;