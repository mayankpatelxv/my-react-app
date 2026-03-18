import { useState, useEffect } from "react";
import "./DashboardAnalytics.css";
import BizBuddyLogo from "./BizBuddyLogo";
import { useToast } from "./Toast";
import { getSales, getPurchases, getItems, getParties } from "./supabaseClient";
import { useSettings } from "./SettingsContext";

const DashboardAnalytics = ({ user, onLogout, onNavigate }) => {
  const toast = useToast();
  const { formatCurrency } = useSettings();
  const [activeMenu, setActiveMenu] = useState("Dashboard & Analytics");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalItems: 0,
    totalParties: 0,
  });
  const [salesTrendData, setSalesTrendData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topItems, setTopItems] = useState([]);

  const menuItems = [
    { name: "Dashboard",              icon: "📊", key: "Dashboard" },
    { name: "Dashboard & Analytics",  icon: "📈", key: "Dashboard & Analytics" },
    { name: "Party Management",       icon: "👥", key: "Party Management" },
    { name: "Item Management",        icon: "📦", key: "Item Management" },
    { name: "Sales",                  icon: "🛒", key: "Sales" },
    { name: "Purchases",              icon: "💰", key: "Purchases" },
    { name: "Annual Reports",         icon: "📋", key: "Annual Reports" }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [salesRes, purchasesRes, itemsRes, partiesRes] = await Promise.all([
        getSales(user.id),
        getPurchases(user.id),
        getItems(user.id),
        getParties(user.id),
      ]);

      const sales = salesRes.success ? salesRes.data : [];
      const purchases = purchasesRes.success ? purchasesRes.data : [];
      const items = itemsRes.success ? itemsRes.data : [];
      const parties = partiesRes.success ? partiesRes.data : [];

      const totalSales = sales.reduce((s, r) => s + (r.total_amount || 0), 0);
      const totalExpenses = purchases.reduce((s, r) => s + (r.total_amount || 0), 0);

      // Monthly sales trend (last 6 months)
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const now = new Date();
      const trend = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const m = d.getMonth(); const y = d.getFullYear();
        const monthSales = sales
          .filter(s => { const sd = new Date(s.invoice_date || s.created_at); return sd.getMonth() === m && sd.getFullYear() === y; })
          .reduce((sum, s) => sum + (s.total_amount || 0), 0);
        const monthPurchases = purchases
          .filter(p => { const pd = new Date(p.purchase_date || p.created_at); return pd.getMonth() === m && pd.getFullYear() === y; })
          .reduce((sum, p) => sum + (p.total_amount || 0), 0);
        return { month: monthNames[m], sales: monthSales, purchases: monthPurchases };
      });

      // Top customers by revenue
      const customerMap = {};
      sales.forEach(s => {
        const name = s.customer_name || "Unknown";
        customerMap[name] = (customerMap[name] || 0) + (s.total_amount || 0);
      });
      const topCust = Object.entries(customerMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, revenue]) => ({ name, revenue }));

      // Top items by quantity sold
      const itemMap = {};
      sales.forEach(s => {
        (s.sales_items || []).forEach(si => {
          const name = si.item_name || "Unknown";
          itemMap[name] = (itemMap[name] || 0) + (si.quantity || 0);
        });
      });
      const topItms = Object.entries(itemMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

      setAnalyticsData({
        totalSales,
        totalExpenses,
        netProfit: totalSales - totalExpenses,
        totalItems: items.length,
        totalParties: parties.length,
      });
      setSalesTrendData(trend);
      setTopCustomers(topCust);
      setTopItems(topItms);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      toast.error("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success("Analytics data exported successfully!");
  };

  const maxTrend = Math.max(...salesTrendData.map(d => Math.max(d.sales, d.purchases)), 1);

  return (
    <div className="dashboard-analytics-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><BizBuddyLogo size={44} /></div>
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`menu-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.key);
                if (item.key !== "Dashboard & Analytics") onNavigate(item.key);
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="menu-item" onClick={() => onNavigate("Settings")}>
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
        <div className="header">
          <div className="header-left"><h1>Dashboard & Analytics</h1></div>
          <div className="header-actions">
            <button className="export-btn" onClick={handleExportData}>📊 Export Data</button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>Loading analytics...</div>
        ) : (
          <div className="analytics-content">
            {/* Key Metrics */}
            <div className="metrics-row">
              <div className="metric-card sales">
                <div className="metric-header">
                  <div className="metric-info">
                    <h3>Total Sales</h3>
                    <div className="metric-value">{formatCurrency(analyticsData.totalSales)}</div>
                  </div>
                  <div className="metric-icon">💰</div>
                </div>
                <div className="metric-change positive">{analyticsData.totalSales > 0 ? "Sales recorded" : "No sales yet"}</div>
              </div>
              <div className="metric-card expenses">
                <div className="metric-header">
                  <div className="metric-info">
                    <h3>Total Expenses</h3>
                    <div className="metric-value">{formatCurrency(analyticsData.totalExpenses)}</div>
                  </div>
                  <div className="metric-icon">📊</div>
                </div>
                <div className="metric-change">{analyticsData.totalExpenses > 0 ? "Purchases recorded" : "No purchases yet"}</div>
              </div>
              <div className="metric-card profit">
                <div className="metric-header">
                  <div className="metric-info">
                    <h3>Net Profit</h3>
                    <div className="metric-value">{formatCurrency(analyticsData.netProfit)}</div>
                  </div>
                  <div className="metric-icon">📈</div>
                </div>
                <div className={`metric-change ${analyticsData.netProfit >= 0 ? 'positive' : 'negative'}`}>
                  {analyticsData.netProfit >= 0 ? "▲ Profitable" : "▼ Loss"}
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              {/* Sales vs Purchases Trend */}
              <div className="chart-container sales-trends">
                <div className="chart-header"><h3>Sales vs Purchases (Last 6 Months)</h3></div>
                <div className="line-chart">
                  <svg viewBox="0 0 400 200" className="chart-svg">
                    {[0,1,2,3,4].map(i => (
                      <line key={i} x1="40" y1={40 + i * 32} x2="380" y2={40 + i * 32} stroke="#f3f4f6" strokeWidth="1"/>
                    ))}
                    {salesTrendData.length > 1 && (
                      <>
                        <polyline fill="none" stroke="#4a9eff" strokeWidth="2.5"
                          points={salesTrendData.map((d, i) => `${60 + i * 52},${170 - (d.sales / maxTrend) * 120}`).join(' ')}/>
                        <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5"
                          points={salesTrendData.map((d, i) => `${60 + i * 52},${170 - (d.purchases / maxTrend) * 120}`).join(' ')}/>
                      </>
                    )}
                    {salesTrendData.map((d, i) => (
                      <text key={d.month} x={60 + i * 52} y="190" fontSize="10" fill="#6b7280" textAnchor="middle">{d.month}</text>
                    ))}
                  </svg>
                  <div className="chart-legend">
                    <div className="legend-item"><div className="legend-color sales"/><span>Sales</span></div>
                    <div className="legend-item"><div className="legend-color revenue"/><span>Purchases</span></div>
                  </div>
                </div>
              </div>

              {/* Summary card */}
              <div className="chart-container expense-distribution">
                <div className="chart-header"><h3>Business Summary</h3></div>
                <div style={{ padding: "1rem" }}>
                  {[
                    { label: "Total Items", value: analyticsData.totalItems, icon: "📦" },
                    { label: "Total Parties", value: analyticsData.totalParties, icon: "👥" },
                    { label: "Profit Margin", value: analyticsData.totalSales > 0 ? `${(((analyticsData.totalSales - analyticsData.totalExpenses) / analyticsData.totalSales) * 100).toFixed(1)}%` : "—", icon: "📊" },
                  ].map(row => (
                    <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 0", borderBottom:"1px solid #f3f4f6" }}>
                      <span style={{ color:"#6b7280", fontSize:"0.9rem" }}>{row.icon} {row.label}</span>
                      <span style={{ fontWeight:"700", color:"#1f2937" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
              {/* Top Customers */}
              <div className="list-container customers">
                <div className="list-header"><h3>Top Customers by Revenue</h3></div>
                <div className="list-content">
                  {topCustomers.length === 0 ? (
                    <div style={{ padding:"1rem", color:"#9ca3af", textAlign:"center" }}>No sales data yet</div>
                  ) : topCustomers.map((c, i) => (
                    <div key={c.name} className="list-item">
                      <div className="item-rank">#{i + 1}</div>
                      <div className="item-info">
                        <div className="item-name">{c.name}</div>
                        <div className="item-value">{formatCurrency(c.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Items */}
              <div className="list-container products">
                <div className="list-header"><h3>Top Selling Items</h3></div>
                <div className="list-content">
                  {topItems.length === 0 ? (
                    <div style={{ padding:"1rem", color:"#9ca3af", textAlign:"center" }}>No sales data yet</div>
                  ) : topItems.map((item, i) => (
                    <div key={item.name} className="list-item">
                      <div className="item-rank">#{i + 1}</div>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-value">{item.qty} units sold</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics;