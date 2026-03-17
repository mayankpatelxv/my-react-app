import { useState, useEffect } from "react";
import "./Dashboard.css";
import AIChatbot from "./AIChatbot";
import { getItems, getParties, getSales, getPurchases } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import LoadingSkeleton from "./LoadingSkeleton";

// SVG Icon components
const IconSales = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconPurchase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconParty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconItem = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconReports = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>
);
const IconAI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
    <path d="M9 17c.83.63 1.94 1 3 1s2.17-.37 3-1"/>
  </svg>
);
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText } = useSettings();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
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
    { name: "Dashboard",        icon: <IconDashboard /> },
    { name: "Party Management", icon: <IconParty /> },
    { name: "Item Management",  icon: <IconItem /> },
    { name: "Sales",            icon: <IconSales /> },
    { name: "Purchases",        icon: <IconPurchase /> },
    { name: "Annual Reports",   icon: <IconReports /> }
  ];

  const stats = [
    {
      title: getText('totalSales'),
      value: dashboardData.loading ? "Loading..." : formatCurrency(dashboardData.totalSales),
      change: dashboardData.totalSales > 0 ? "Active sales recorded" : "No sales yet",
      icon: <IconSales />,
      color: "blue"
    },
    {
      title: getText('totalPurchases'),
      value: dashboardData.loading ? "Loading..." : formatCurrency(dashboardData.totalPurchases),
      change: dashboardData.totalPurchases > 0 ? "Active purchases recorded" : "No purchases yet",
      icon: <IconPurchase />,
      color: "orange"
    },
    {
      title: getText('totalItems'),
      value: dashboardData.loading ? "Loading..." : dashboardData.totalItems.toString(),
      change: dashboardData.totalItems > 0 ? `${dashboardData.totalItems} items in inventory` : "No items yet",
      icon: <IconItem />,
      color: "green"
    },
    {
      title: getText('totalParties'),
      value: dashboardData.loading ? "Loading..." : dashboardData.totalParties.toString(),
      change: dashboardData.totalParties > 0 ? `${dashboardData.totalParties} customers & suppliers` : "No parties yet",
      icon: <IconParty />,
      color: "purple"
    }
  ];

  const quickActions = [
    { name: "Create New Invoice", icon: <IconSales />,    color: "blue" },
    { name: "Add New Party",      icon: <IconParty />,    color: "green" },
    { name: "Add New Item",       icon: <IconItem />,     color: "blue" },
    { name: "AI Assistant",       icon: <IconAI />,       color: "purple" }
  ];

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1>{getText('welcome')}, {user?.name || "User"}!</h1>
          <button className="settings-btn" onClick={() => onNavigate("Settings")}>
            <span className="settings-icon"><IconSettings /></span>
            Settings
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {dashboardData.loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="stat-card skeleton">
                  <LoadingSkeleton type="card" />
                </div>
              ))}
            </>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.color}`}>
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>{getText('quickActions')}</h2>
          <div className="action-cards-row">
            <div className="action-card" onClick={() => onNavigate("Sales")}>
              <div className="action-card-icon"><IconSales /></div>
              <div className="action-card-content">
                <h4>Record Sale</h4>
                <p>Add new sales transactions</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => onNavigate("Purchases")}>
              <div className="action-card-icon"><IconPurchase /></div>
              <div className="action-card-content">
                <h4>Record Purchase</h4>
                <p>Track your expenses</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => onNavigate("Party Management")}>
              <div className="action-card-icon"><IconParty /></div>
              <div className="action-card-content">
                <h4>Party Management</h4>
                <p>Manage customers & suppliers</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div className="action-card" onClick={() => onNavigate("Item Management")}>
              <div className="action-card-icon"><IconItem /></div>
              <div className="action-card-content">
                <h4>Item Management</h4>
                <p>Manage your inventory</p>
              </div>
              <div className="action-arrow">→</div>
            </div>

            <div className="action-card" onClick={() => onNavigate("Annual Reports")}>
              <div className="action-card-icon"><IconReports /></div>
              <div className="action-card-content">
                <h4>Annual Reports</h4>
                <p>View business analytics</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
            
            <div className="action-card" onClick={() => setIsChatbotOpen(true)}>
              <div className="action-card-icon"><IconAI /></div>
              <div className="action-card-content">
                <h4>AI Assistant</h4>
                <p>Get business insights</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION ── */}
        <div className="bottom-section">

          {/* Profit Overview */}
          <div className="db-card profit-card">
            <div className="db-card-header">
              <div className="db-card-title">
                <span className="db-card-icon-wrap blue"><IconTrendUp /></span>
                <span>Profit Overview</span>
              </div>
              <button className="db-link-btn" onClick={() => onNavigate("Annual Reports")}>View Reports →</button>
            </div>
            <div className="profit-bars">
              <div className="profit-bar-row">
                <div className="profit-bar-label"><span className="profit-dot blue-dot"/><span>Total Sales</span></div>
                <div className="profit-bar-track">
                  <div className="profit-bar-fill sales-bar" style={{ width: dashboardData.totalSales > 0 ? '100%' : '4px' }}/>
                </div>
                <span className="profit-bar-value">{formatCurrency(dashboardData.totalSales)}</span>
              </div>
              <div className="profit-bar-row">
                <div className="profit-bar-label"><span className="profit-dot orange-dot"/><span>Total Purchases</span></div>
                <div className="profit-bar-track">
                  <div className="profit-bar-fill purchase-bar" style={{ width: dashboardData.totalSales > 0 ? `${Math.min((dashboardData.totalPurchases / dashboardData.totalSales) * 100, 100)}%` : '4px' }}/>
                </div>
                <span className="profit-bar-value">{formatCurrency(dashboardData.totalPurchases)}</span>
              </div>
              <div className="profit-bar-row">
                <div className="profit-bar-label"><span className="profit-dot green-dot"/><span>Net Profit</span></div>
                <div className="profit-bar-track">
                  <div className="profit-bar-fill profit-bar-fill-green" style={{ width: dashboardData.totalSales > 0 ? `${Math.max(0, Math.min((Math.abs(dashboardData.totalSales - dashboardData.totalPurchases) / dashboardData.totalSales) * 100, 100))}%` : '4px' }}/>
                </div>
                <span className="profit-bar-value net-profit-val">{formatCurrency(dashboardData.totalSales - dashboardData.totalPurchases)}</span>
              </div>
            </div>
            <div className="profit-footer">
              <div className="profit-footer-item">
                <span className="pf-label">Profit Margin</span>
                <span className="pf-value blue">{dashboardData.totalSales > 0 ? `${(((dashboardData.totalSales - dashboardData.totalPurchases) / dashboardData.totalSales) * 100).toFixed(1)}%` : '—'}</span>
              </div>
              <div className="profit-footer-divider"/>
              <div className="profit-footer-item">
                <span className="pf-label">Status</span>
                <span className={`pf-value ${dashboardData.totalSales >= dashboardData.totalPurchases ? 'green' : 'red'}`}>
                  {dashboardData.totalSales >= dashboardData.totalPurchases ? '▲ Profitable' : '▼ Loss'}
                </span>
              </div>
              <div className="profit-footer-divider"/>
              <div className="profit-footer-item">
                <span className="pf-label">Inventory</span>
                <span className="pf-value purple">{dashboardData.totalItems} items</span>
              </div>
            </div>
          </div>

          {/* Financial Summary — SVG ring chart */}
          <div className="db-card summary-card">
            <div className="db-card-header">
              <div className="db-card-title">
                <span className="db-card-icon-wrap purple"><IconReports /></span>
                <span>Financial Summary</span>
              </div>
              <span className="live-badge">● Live</span>
            </div>
            <div className="ring-chart-wrap">
              {(() => {
                const total = dashboardData.totalSales + dashboardData.totalPurchases || 1;
                const salesPct = (dashboardData.totalSales / total) * 100;
                const r = 54; const circ = 2 * Math.PI * r;
                const salesDash = (salesPct / 100) * circ;
                return (
                  <svg viewBox="0 0 140 140" className="ring-svg">
                    <defs>
                      <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4a9eff"/><stop offset="100%" stopColor="#667eea"/>
                      </linearGradient>
                      <linearGradient id="gOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#f97316"/>
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r={r} fill="none" stroke="#f0f0f5" strokeWidth="14"/>
                    <circle cx="70" cy="70" r={r} fill="none" stroke="url(#gOrange)" strokeWidth="14"
                      strokeDasharray={circ} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 70 70)"/>
                    <circle cx="70" cy="70" r={r} fill="none" stroke="url(#gBlue)" strokeWidth="14"
                      strokeDasharray={`${salesDash} ${circ - salesDash}`} strokeDashoffset="0"
                      strokeLinecap="round" transform="rotate(-90 70 70)"/>
                    <text x="70" y="64" textAnchor="middle" fontSize="11" fill="#6b7280" fontFamily="inherit">Margin</text>
                    <text x="70" y="82" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1f2937" fontFamily="inherit">
                      {dashboardData.totalSales > 0 ? `${(((dashboardData.totalSales - dashboardData.totalPurchases) / dashboardData.totalSales) * 100).toFixed(0)}%` : '0%'}
                    </text>
                  </svg>
                );
              })()}
              <div className="ring-legend">
                <div className="ring-legend-item">
                  <span className="ring-dot" style={{ background: 'linear-gradient(135deg,#4a9eff,#667eea)' }}/>
                  <div><div className="ring-legend-label">Sales</div><div className="ring-legend-val">{formatCurrency(dashboardData.totalSales)}</div></div>
                </div>
                <div className="ring-legend-item">
                  <span className="ring-dot" style={{ background: 'linear-gradient(135deg,#f59e0b,#f97316)' }}/>
                  <div><div className="ring-legend-label">Purchases</div><div className="ring-legend-val">{formatCurrency(dashboardData.totalPurchases)}</div></div>
                </div>
              </div>
            </div>
            <div className="summary-rows">
              <div className="summary-row">
                <span className="sr-label"><IconParty /> Parties</span>
                <span className="sr-value">{dashboardData.totalParties}</span>
              </div>
              <div className="summary-row">
                <span className="sr-label"><IconItem /> Inventory</span>
                <span className="sr-value">{dashboardData.totalItems} items</span>
              </div>
              <div className="summary-row">
                <span className="sr-label"><IconTrendUp /> Net Profit</span>
                <span className={`sr-value ${dashboardData.totalSales - dashboardData.totalPurchases >= 0 ? 'green' : 'red'}`}>
                  {formatCurrency(dashboardData.totalSales - dashboardData.totalPurchases)}
                </span>
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
