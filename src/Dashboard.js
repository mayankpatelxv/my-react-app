import { useState } from "react";
import "./Dashboard.css";
import AIChatbot from "./AIChatbot";

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      value: "€0.00",
      change: "No sales yet",
      icon: "🛒",
      color: "blue"
    },
    {
      title: "Total Purchases",
      value: "€0.00",
      change: "No purchases yet",
      icon: "💰",
      color: "orange"
    },
    {
      title: "Total Expenses",
      value: "€0.00",
      change: "No expenses yet",
      icon: "💸",
      color: "red"
    },
    {
      title: "Outstanding Balances",
      value: "€0.00",
      change: "No outstanding balances",
      icon: "📋",
      color: "gray"
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
            <div className="empty-chart">
              <div className="empty-icon">📊</div>
              <h3>No Data Available</h3>
              <p>Start adding sales and purchases to see your overview chart here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;