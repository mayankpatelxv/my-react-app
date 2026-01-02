import { useState } from "react";
import "./AnnualReports.css";
import AnalyticsReport from "./AnalyticsReport";

const AnnualReports = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Annual Reports");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showAnalyticsReport, setShowAnalyticsReport] = useState(false);

  // If Analytics Report is active, show that component
  if (showAnalyticsReport) {
    return <AnalyticsReport onBack={() => setShowAnalyticsReport(false)} />;
  }

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const years = ["2024", "2023", "2022", "2021", "2020"];

  // Sample data for the reports
  const reportData = {
    totalRevenue: 1250000,
    totalExpenses: 850000,
    netProfit: 400000,
    profitMargin: 32,
    revenueGrowth: 12.5,
    expenseGrowth: -5.2,
    profitGrowth: 25.0,
    marginGrowth: 3.5
  };

  const monthlyData = [
    { month: "Jan", sales: 95000, purchases: 45000, expenses: 25000 },
    { month: "Feb", sales: 88000, purchases: 42000, expenses: 23000 },
    { month: "Mar", sales: 105000, purchases: 48000, expenses: 27000 },
    { month: "Apr", sales: 98000, purchases: 46000, expenses: 25000 },
    { month: "May", sales: 115000, purchases: 52000, expenses: 28000 },
    { month: "Jun", sales: 108000, purchases: 50000, expenses: 26000 },
    { month: "Jul", sales: 125000, purchases: 55000, expenses: 30000 },
    { month: "Aug", sales: 132000, purchases: 58000, expenses: 32000 },
    { month: "Sep", sales: 118000, purchases: 54000, expenses: 29000 },
    { month: "Oct", sales: 128000, purchases: 56000, expenses: 31000 },
    { month: "Nov", sales: 110000, purchases: 51000, expenses: 28000 },
    { month: "Dec", sales: 102000, purchases: 48000, expenses: 26000 }
  ];

  const topCustomers = [
    { name: "Acme Corporation", revenue: 125000, growth: 15.2 },
    { name: "Tech Solutions Ltd", revenue: 98000, growth: 8.7 },
    { name: "Global Industries", revenue: 87000, growth: -2.1 },
    { name: "Innovation Hub", revenue: 76000, growth: 22.5 },
    { name: "Digital Dynamics", revenue: 65000, growth: 12.8 }
  ];

  const topSuppliers = [
    { name: "Office Supplies Inc", amount: 85000, growth: -5.2 },
    { name: "Tech Hardware Ltd", amount: 72000, growth: 3.8 },
    { name: "Business Equipment Co", amount: 68000, growth: 8.1 },
    { name: "Global Tech Solutions", amount: 59000, growth: -1.5 },
    { name: "Digital Solutions Provider", amount: 45000, growth: 15.3 }
  ];

  const handleExportPDF = () => {
    console.log("Exporting PDF report for year:", selectedYear);
    alert("PDF report exported successfully!");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getMaxValue = () => {
    return Math.max(...monthlyData.map(data => 
      data.sales + data.purchases + data.expenses
    ));
  };

  const maxValue = getMaxValue();

  return (
    <div className="annual-reports-container">
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
              className={`menu-item ${activeMenu === item.name ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.name);
                if (item.name !== "Annual Reports") {
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
            <h1>Annual Reports</h1>
          </div>
          <div className="header-actions">
            <button 
              className="analytics-btn"
              onClick={() => setShowAnalyticsReport(true)}
            >
              📈 Dashboard & Analytics
            </button>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="export-btn" onClick={handleExportPDF}>
              📄 Export PDF
            </button>
            <button className="notification-btn">🔔</button>
            <div className="user-menu">
              <button className="user-avatar" onClick={onLogout}>
                👤
              </button>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="reports-content">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card revenue">
              <div className="metric-header">
                <h3>Total Revenue</h3>
                <span className="metric-icon">💰</span>
              </div>
              <div className="metric-value">{formatCurrency(reportData.totalRevenue)}</div>
              <div className="metric-change positive">
                {formatPercentage(reportData.revenueGrowth)} vs last year
              </div>
            </div>

            <div className="metric-card expenses">
              <div className="metric-header">
                <h3>Total Expenses</h3>
                <span className="metric-icon">📊</span>
              </div>
              <div className="metric-value">{formatCurrency(reportData.totalExpenses)}</div>
              <div className="metric-change negative">
                {formatPercentage(reportData.expenseGrowth)} vs last year
              </div>
            </div>

            <div className="metric-card profit">
              <div className="metric-header">
                <h3>Net Profit</h3>
                <span className="metric-icon">📈</span>
              </div>
              <div className="metric-value">{formatCurrency(reportData.netProfit)}</div>
              <div className="metric-change positive">
                {formatPercentage(reportData.profitGrowth)} vs last year
              </div>
            </div>

            <div className="metric-card margin">
              <div className="metric-header">
                <h3>Profit Margin</h3>
                <span className="metric-icon">📋</span>
              </div>
              <div className="metric-value">{reportData.profitMargin}%</div>
              <div className="metric-change positive">
                {formatPercentage(reportData.marginGrowth)} vs last year
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <h2>Sales vs Purchases vs Expenses</h2>
            <div className="chart-container">
              <div className="chart-y-axis">
                <div className="y-label">20000</div>
                <div className="y-label">15000</div>
                <div className="y-label">10000</div>
                <div className="y-label">5000</div>
                <div className="y-label">0</div>
              </div>
              <div className="chart-bars">
                {monthlyData.map((data, index) => {
                  const totalHeight = 200; // Max height in pixels
                  const salesHeight = (data.sales / maxValue) * totalHeight;
                  const purchasesHeight = (data.purchases / maxValue) * totalHeight;
                  const expensesHeight = (data.expenses / maxValue) * totalHeight;
                  
                  return (
                    <div key={data.month} className="bar-group">
                      <div className="bar-stack">
                        <div 
                          className="bar sales-bar" 
                          style={{ height: `${salesHeight}px` }}
                          title={`Sales: ${formatCurrency(data.sales)}`}
                        ></div>
                        <div 
                          className="bar purchases-bar" 
                          style={{ height: `${purchasesHeight}px` }}
                          title={`Purchases: ${formatCurrency(data.purchases)}`}
                        ></div>
                        <div 
                          className="bar expenses-bar" 
                          style={{ height: `${expensesHeight}px` }}
                          title={`Expenses: ${formatCurrency(data.expenses)}`}
                        ></div>
                      </div>
                      <div className="bar-label">{data.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color sales"></div>
                <span>Sales</span>
              </div>
              <div className="legend-item">
                <div className="legend-color purchases"></div>
                <span>Purchases</span>
              </div>
              <div className="legend-item">
                <div className="legend-color expenses"></div>
                <span>Expenses</span>
              </div>
            </div>
          </div>

          {/* Top Lists */}
          <div className="top-lists">
            <div className="top-list customers-list">
              <div className="list-header">
                <h3>👥 Top Customers</h3>
              </div>
              <div className="list-content">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="list-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name">{customer.name}</div>
                      <div className="item-amount">{formatCurrency(customer.revenue)}</div>
                    </div>
                    <div className={`item-growth ${customer.growth >= 0 ? 'positive' : 'negative'}`}>
                      {formatPercentage(customer.growth)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="top-list suppliers-list">
              <div className="list-header">
                <h3>⚙️ Top Suppliers</h3>
              </div>
              <div className="list-content">
                {topSuppliers.map((supplier, index) => (
                  <div key={supplier.name} className="list-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name">{supplier.name}</div>
                      <div className="item-amount">{formatCurrency(supplier.amount)}</div>
                    </div>
                    <div className={`item-growth ${supplier.growth >= 0 ? 'positive' : 'negative'}`}>
                      {formatPercentage(supplier.growth)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualReports;