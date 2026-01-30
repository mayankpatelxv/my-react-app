import { useState, useEffect } from "react";
import "./Dashboard.css";
import AIChatbot from "./AIChatbot";
import { getItems, getParties, getSales, getPurchases } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText } = useSettings();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  // Initialize sidebar state based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // On mobile (< 768px), start closed; on desktop, start open
    return window.innerWidth >= 768;
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalItems: 0,
    totalParties: 0,
    loading: true
  });

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      // On desktop, ensure sidebar is open by default
      if (window.innerWidth >= 768 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch all data in parallel
      const [itemsResult, partiesResult, salesResult, purchasesResult] = await Promise.all([
        getItems(user.id),
        getParties(user.id),
        getSales ? getSales(user.id) : { success: true, data: [] },
        getPurchases ? getPurchases(user.id) : { success: true, data: [] }
      ]);

      let totalSales = 0;
      let totalPurchases = 0;

      // Calculate total sales
      if (salesResult.success && salesResult.data) {
        totalSales = salesResult.data.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
      }

      // Calculate total purchases
      if (purchasesResult.success && purchasesResult.data) {
        totalPurchases = purchasesResult.data.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0);
      }

      setDashboardData({
        totalSales,
        totalPurchases,
        totalItems: itemsResult.success ? (itemsResult.data?.length || 0) : 0,
        totalParties: partiesResult.success ? (partiesResult.data?.length || 0) : 0,
        loading: false
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const stats = [
    {
      title: getText('totalSales'),
      value: dashboardData.loading ? "Loading..." : formatCurrency(dashboardData.totalSales),
      change: dashboardData.totalSales > 0 ? "Active sales recorded" : "No sales yet",
      icon: "🛒",
      color: "blue"
    },
    {
      title: getText('totalPurchases'),
      value: dashboardData.loading ? "Loading..." : formatCurrency(dashboardData.totalPurchases),
      change: dashboardData.totalPurchases > 0 ? "Active purchases recorded" : "No purchases yet",
      icon: "💰",
      color: "orange"
    },
    {
      title: getText('totalItems'),
      value: dashboardData.loading ? "Loading..." : dashboardData.totalItems.toString(),
      change: dashboardData.totalItems > 0 ? `${dashboardData.totalItems} items in inventory` : "No items yet",
      icon: "📦",
      color: "green"
    },
    {
      title: getText('totalParties'),
      value: dashboardData.loading ? "Loading..." : dashboardData.totalParties.toString(),
      change: dashboardData.totalParties > 0 ? `${dashboardData.totalParties} customers & suppliers` : "No parties yet",
      icon: "👥",
      color: "purple"
    }
  ];

  const quickActions = [
    { name: "Create New Invoice", icon: "📄", color: "blue" },
    { name: "Add New Party", icon: "👤", color: "green" },
    { name: "Add New Item", icon: "➕", color: "blue" },
    { name: "AI Assistant", icon: "🤖", color: "purple" }
  ];

  return (
    <div className="dashboard-container">
      {/* Hamburger Menu Button - Works on all screens */}
      <button 
        className="hamburger-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Overlay - Only on mobile when sidebar is open */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar - Toggleable on all screens */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo-section">
          <div className="logo-icon">
            <BizBuddyLogo size={44} />
          </div>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`menu-item ${activeMenu === item.name ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.name);
                // On mobile, close sidebar after navigation
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
                if (item.name !== "Dashboard") {
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
          <div className="menu-item" onClick={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
            onNavigate("Settings");
          }}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Settings</span>
          </div>
          <div className="menu-item logout" onClick={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
            onLogout();
          }}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <div className="header">
          <h1>{getText('welcome')}, {user?.name || "User"}!</h1>
          <div className="header-actions">
            <div className="user-menu">
              <button 
                className="user-avatar" 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                👤
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div 
                    className="user-menu-overlay" 
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-avatar-large">👤</div>
                      <div className="user-info">
                        <h3>{user?.name || "User"}</h3>
                        <p>{user?.email || "user@example.com"}</p>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <div className="user-dropdown-body">
                      <div className="user-detail-item">
                        <span className="detail-icon">📧</span>
                        <div className="detail-content">
                          <span className="detail-label">Email</span>
                          <span className="detail-value">{user?.email || "Not provided"}</span>
                        </div>
                      </div>
                      <div className="user-detail-item">
                        <span className="detail-icon">👤</span>
                        <div className="detail-content">
                          <span className="detail-label">Name</span>
                          <span className="detail-value">{user?.name || "Not provided"}</span>
                        </div>
                      </div>
                      <div className="user-detail-item">
                        <span className="detail-icon">🆔</span>
                        <div className="detail-content">
                          <span className="detail-label">User ID</span>
                          <span className="detail-value">{user?.id ? user.id.substring(0, 8) + "..." : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <div className="user-dropdown-footer">
                      <button 
                        className="user-dropdown-btn settings-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate("Settings");
                        }}
                      >
                        <span>⚙️</span>
                        Settings
                      </button>
                      <button 
                        className="user-dropdown-btn logout-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <span>🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>{getText('quickActions')}</h2>
          <div className="action-cards-row">
            <div className="action-card" onClick={() => onNavigate("Sales")}>
              <div className="action-card-icon">🛒</div>
              <div className="action-card-content">
                <h4>Record Sale</h4>
                <p>Add new sales transactions</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => onNavigate("Purchases")}>
              <div className="action-card-icon">💰</div>
              <div className="action-card-content">
                <h4>Record Purchase</h4>
                <p>Track your expenses</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => setIsChatbotOpen(true)}>
              <div className="action-card-icon">🤖</div>
              <div className="action-card-content">
                <h4>AI Assistant</h4>
                <p>Get business insights</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity-section">
          <div className="activity-header">
            <h2>📋 {getText('recentActivity')}</h2>
            <button 
              className="view-all-btn"
              onClick={() => onNavigate("Annual Reports")}
            >
              View All Reports
            </button>
          </div>
          
          <div className="activity-grid">
            {/* Business Insights Card */}
            <div className="activity-card insights-card">
              <div className="card-header">
                <h3>💡 Business Insights</h3>
                <span className="insight-badge">AI Powered</span>
              </div>
              <div className="insights-content">
                <div className="insight-item">
                  <div className="insight-icon">📈</div>
                  <div className="insight-text">
                    <strong>Growth Trend:</strong> Your business is showing positive momentum with {dashboardData.totalSales > dashboardData.totalPurchases ? 'profitable' : 'developing'} operations.
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-text">
                    <strong>Next Steps:</strong> {dashboardData.totalItems === 0 ? 'Add your first items to inventory' : dashboardData.totalParties === 0 ? 'Add customers and suppliers' : 'Consider expanding your product range'}
                  </div>
                </div>
                <div className="insight-item">
                  <div className="insight-icon">💰</div>
                  <div className="insight-text">
                    <strong>Financial Health:</strong> {dashboardData.totalSales > 0 ? `Revenue of $${dashboardData.totalSales.toFixed(2)} recorded` : 'Ready to record your first sale'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="activity-card stats-card">
              <div className="card-header">
                <h3>⚡ Quick Overview</h3>
                <span className="stats-badge">Live Data</span>
              </div>
              <div className="quick-stats-grid">
                <div className="quick-stat-item">
                  <div className="stat-number">{dashboardData.totalItems}</div>
                  <div className="stat-label">Items</div>
                  <div className="stat-icon">📦</div>
                </div>
                <div className="quick-stat-item">
                  <div className="stat-number">{dashboardData.totalParties}</div>
                  <div className="stat-label">Parties</div>
                  <div className="stat-icon">👥</div>
                </div>
                <div className="quick-stat-item">
                  <div className="stat-number">${(dashboardData.totalSales - dashboardData.totalPurchases).toFixed(0)}</div>
                  <div className="stat-label">Net Profit</div>
                  <div className="stat-icon">💎</div>
                </div>
                <div className="quick-stat-item">
                  <div className="stat-number">{dashboardData.totalSales > 0 ? (((dashboardData.totalSales - dashboardData.totalPurchases) / dashboardData.totalSales) * 100).toFixed(0) : 0}%</div>
                  <div className="stat-label">Margin</div>
                  <div className="stat-icon">📊</div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;