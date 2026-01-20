import { useState, useEffect } from "react";
import "./Dashboard.css";
import AIChatbot from "./AIChatbot";
import { getItems, getParties, getSales, getPurchases } from "./supabaseClient";

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalItems: 0,
    totalParties: 0,
    loading: true
  });

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
      title: "Total Sales",
      value: dashboardData.loading ? "Loading..." : `$${dashboardData.totalSales.toFixed(2)}`,
      change: dashboardData.totalSales > 0 ? "Active sales recorded" : "No sales yet",
      icon: "🛒",
      color: "blue"
    },
    {
      title: "Total Purchases",
      value: dashboardData.loading ? "Loading..." : `$${dashboardData.totalPurchases.toFixed(2)}`,
      change: dashboardData.totalPurchases > 0 ? "Active purchases recorded" : "No purchases yet",
      icon: "💰",
      color: "orange"
    },
    {
      title: "Total Items",
      value: dashboardData.loading ? "Loading..." : dashboardData.totalItems.toString(),
      change: dashboardData.totalItems > 0 ? `${dashboardData.totalItems} items in inventory` : "No items yet",
      icon: "📦",
      color: "green"
    },
    {
      title: "Total Parties",
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
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
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
                setIsMobileMenuOpen(false);
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
            setIsMobileMenuOpen(false);
            onNavigate("Settings");
          }}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Settings</span>
          </div>
          <div className="menu-item logout" onClick={() => {
            setIsMobileMenuOpen(false);
            onLogout();
          }}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1>Welcome back, {user?.name || "User"}!</h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <div className="user-menu">
              <button className="user-avatar" onClick={onLogout}>
                👤
              </button>
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
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <button 
                key={index} 
                className={`action-btn ${action.color}`}
                onClick={() => {
                  if (action.name === "Create New Invoice") {
                    onNavigate("Create Invoice");
                  } else if (action.name === "Add New Party") {
                    onNavigate("Add Party");
                  } else if (action.name === "Add New Item") {
                    onNavigate("Add Item");
                  } else if (action.name === "AI Assistant") {
                    setIsChatbotOpen(true);
                  }
                }}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-text">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <h2>Sales & Purchases Overview</h2>
          <div className="chart-container">
            {dashboardData.loading ? (
              <div className="loading-chart">
                <div className="loading-icon">⏳</div>
                <h3>Loading Chart Data...</h3>
                <p>Please wait while we fetch your data.</p>
              </div>
            ) : dashboardData.totalSales === 0 && dashboardData.totalPurchases === 0 ? (
              <div className="empty-chart">
                <div className="empty-icon">📊</div>
                <h3>No Data Available</h3>
                <p>Start adding sales and purchases to see your overview chart here.</p>
              </div>
            ) : (
              <div className="simple-chart">
                <div className="chart-bars">
                  <div className="chart-bar">
                    <div className="bar-label">Sales</div>
                    <div className="bar-container">
                      <div 
                        className="bar sales-bar" 
                        style={{ 
                          height: `${Math.max(20, (dashboardData.totalSales / Math.max(dashboardData.totalSales, dashboardData.totalPurchases)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">${dashboardData.totalSales.toFixed(2)}</div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar-label">Purchases</div>
                    <div className="bar-container">
                      <div 
                        className="bar purchases-bar" 
                        style={{ 
                          height: `${Math.max(20, (dashboardData.totalPurchases / Math.max(dashboardData.totalSales, dashboardData.totalPurchases)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">${dashboardData.totalPurchases.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
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