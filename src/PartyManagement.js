import { useState, useEffect } from "react";
import "./PartyManagement.css";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";

const PartyManagement = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        alert("Error loading parties: " + result.error);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
      alert("Error loading parties: " + error.message);
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
    if (!window.confirm("Are you sure you want to delete this party?")) {
      return;
    }

    try {
      const { deleteParty } = await import('./supabaseClient');
      const result = await deleteParty(partyId, user.id);
      
      if (result.success) {
        alert("Party deleted successfully!");
        fetchParties(); // Refresh the list
      } else {
        alert("Error deleting party: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting party:", error);
      alert("Error deleting party: " + error.message);
    }
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
          <div className="header-left">
            <h1>Party Management</h1>
            <p>Manage your customers and suppliers efficiently.</p>
          </div>
          <div className="header-actions">
            <button className="add-party-btn" onClick={() => onNavigate("Add Party")}>
              <span>+</span>
              Add New Party
            </button>
            <div className="user-menu">
              <button className="user-avatar" onClick={onLogout}>
                👤
              </button>
            </div>
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
                  <td colSpan="6" className="loading-state">
                    <div className="loading-content">
                      <div className="loading-icon">⏳</div>
                      <h3>Loading Parties...</h3>
                      <p>Please wait while we fetch your party data.</p>
                    </div>
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
                        onClick={() => {/* TODO: Implement edit functionality */}}
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
    </div>
  );
};

export default PartyManagement;