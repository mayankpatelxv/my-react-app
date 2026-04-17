import { useState, useEffect } from "react";
import "./PartyManagement.css";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import LoadingSkeleton from "./LoadingSkeleton";
import CSVImport from "./CSVImport";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import { handleNumericKeyPress } from "./utils/validation";

const PartyManagement = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
  const toast = useToast();
  const confirm = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    party_type: "Customer",
    email: "",
    phone: "",
    address: "",
    credit_limit: 0
  });

  // Fetch parties when component mounts
  useEffect(() => {
    fetchParties();
  }, [user]);

  const fetchParties = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { getParties } = await import('./supabaseClient');
      const result = await getParties(user.id);
      
      if (result.success) {
        setParties(result.data || []);
      } else {
        console.error("Error fetching parties:", result.error);
        toast.error("Error loading parties: " + result.error);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      toast.error("Error loading parties: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" }
  ];

  const filteredParties = parties.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || party.party_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteParty = async (partyId) => {
    const ok = await confirm({
      title: "Delete Party?",
      message: "This will permanently remove the party and cannot be undone.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      const { deleteParty } = await import('./supabaseClient');
      const result = await deleteParty(partyId, user.id);
      if (result.success) {
        toast.success("Party deleted successfully!");
        fetchParties();
      } else {
        toast.error("Error deleting party: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting party:", error);
      toast.error("Error deleting party: " + error.message);
    }
  };

  const handleEditParty = (party) => {
    setEditingParty(party);
    setEditFormData({
      name: party.name || "",
      party_type: party.party_type || "Customer",
      email: party.email || "",
      phone: party.phone || "",
      address: party.address || "",
      credit_limit: party.credit_limit || 0
    });
  };

  const handleUpdateParty = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name.trim()) {
      toast.warning("Party name is required");
      return;
    }

    try {
      const { updateParty } = await import('./supabaseClient');
      
      // Convert snake_case to camelCase for updateParty function
      const updateData = {
        name: editFormData.name,
        partyType: editFormData.party_type,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
        creditLimit: editFormData.credit_limit
      };
      
      const result = await updateParty(editingParty.id, updateData, user.id);
      
      if (result.success) {
        toast.success("Party updated successfully!");
        setEditingParty(null);
        fetchParties();
      } else {
        toast.error("Error updating party: " + result.error);
      }
    } catch (error) {
      console.error("Error updating party:", error);
      toast.error("Error updating party: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingParty(null);
    setEditFormData({
      name: "",
      party_type: "Customer",
      email: "",
      phone: "",
      address: "",
      credit_limit: 0
    });
  };

  return (
    <div className="party-management-container">
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
              className={`menu-item ${item.key === "Party Management" ? "active" : ""}`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(item.key);
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
            <h1>Party Management</h1>
            <p>Manage your customers and suppliers efficiently.</p>
          </div>
          <div className="header-actions">
            <button className="add-party-btn" onClick={() => onNavigate("Add Party")}>
              <span>+</span>
              Add New Party
            </button>
            <button className="csv-import-btn" onClick={() => setShowCSVImport(true)}>
              📥 Import CSV
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search parties by name or contact"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <span className="filter-icon">🔽</span>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">Filter</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
        </div>

        {/* Party Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>Party Details</h2>
          </div>
          
          <table className="party-table">
            <thead>
              <tr>
                <th>Name ↕</th>
                <th>Contact ↕</th>
                <th>Outstanding Balance ↕</th>
                <th>Last Activity ↕</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="loading-skeleton-cell">
                    <LoadingSkeleton type="table" rows={5} columns={6} />
                  </td>
                </tr>
              ) : filteredParties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <div className="empty-content">
                      <div className="empty-icon">👥</div>
                      <h3>No Parties Found</h3>
                      <p>Start by adding your first customer or supplier using the "Add New Party" button.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParties.map((party) => (
                  <tr key={party.id}>
                    <td className="party-name">{party.name}</td>
                    <td className="party-contact">{party.email}</td>
                    <td className="party-balance">
                      {formatCurrency(party.credit_limit || 0)}
                    </td>
                    <td className="party-activity">
                      {formatDate(party.created_at)}
                    </td>
                    <td>
                      <span className={`type-badge ${party.party_type.toLowerCase()}`}>
                        {party.party_type}
                      </span>
                    </td>
                    <td className="party-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditParty(party)}
                        title="Edit Party"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteParty(party.id)}
                        title="Delete Party"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="page-footer">
          © 2025 Smart Business Management. All rights reserved.
        </footer>
      </div>

      {/* Edit Party Modal */}
      {editingParty && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Party</h2>
              <button className="modal-close" onClick={handleCancelEdit}>×</button>
            </div>
            
            <form onSubmit={handleUpdateParty} className="edit-form">
              <div className="form-group">
                <label htmlFor="edit-name">Party Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  required
                  placeholder="Enter party name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-type">Party Type *</label>
                <select
                  id="edit-type"
                  value={editFormData.party_type}
                  onChange={(e) => setEditFormData({...editFormData, party_type: e.target.value})}
                  required
                >
                  <option value="Customer">Customer</option>
                  <option value="Supplier">Supplier</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-phone">Phone</label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-address">Address</label>
                <textarea
                  id="edit-address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  placeholder="Enter address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-credit">Credit Limit</label>
                <input
                  id="edit-credit"
                  type="number"
                  value={editFormData.credit_limit}
                  onChange={(e) => setEditFormData({...editFormData, credit_limit: parseFloat(e.target.value) || 0})}
                  onKeyDown={handleNumericKeyPress}
                  placeholder="Enter credit limit"
                  step="0.01"
                  min="0"
                  max="1000000"
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

      {showCSVImport && (
        <CSVImport
          type="parties"
          user={user}
          onClose={() => setShowCSVImport(false)}
          onSuccess={() => { setShowCSVImport(false); fetchParties(); }}
        />
      )}
    </div>
  );
};

export default PartyManagement;