import { useState } from "react";
import "./DashboardAnalytics.css";
import BizBuddyLogo from "./BizBuddyLogo";
import { useToast } from "./Toast";
const DashboardAnalytics = ({ user, onLogout, onNavigate }) => {
  const toast = useToast();
  const [activeMenu, setActiveMenu] = useState("Dashboard & Analytics");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [location, setLocation] = useState("All Locations");

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Dashboard & Analytics", icon: "📈" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📋" }
  ];

  const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"];
  const locations = ["All Locations", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

  // Sample analytics data
  const analyticsData = {
    totalSales: 45231.89,
    salesGrowth: 20.1,
    totalExpenses: 15100.00,
    expenseGrowth: -3.2,
    netProfit: 30131.89,
    profitGrowth: 18.8
  };

  const salesTrendData = [
    { month: "Jan", sales: 500, revenue: 520 },
    { month: "Feb", sales: 480, revenue: 500 },
    { month: "Mar", sales: 650, revenue: 680 },
    { month: "Apr", sales: 700, revenue: 720 },
    { month: "May", sales: 680, revenue: 700 },
    { month: "Jun", sales: 750, revenue: 780 },
    { month: "Jul", sales: 820, revenue: 850 },
    { month: "Aug", sales: 880, revenue: 920 },
    { month: "Sep", sales: 850, revenue: 890 },
    { month: "Oct", sales: 900, revenue: 950 },
    { month: "Nov", sales: 980, revenue: 1020 },
    { month: "Dec", sales: 1000, revenue: 1100 }
  ];

  const expenseCategories = [
    { name: "Marketing", percentage: 35, color: "#4a9eff" },
    { name: "Operations", percentage: 25, color: "#10b981" },
    { name: "Salaries", percentage: 20, color: "#f59e0b" },
    { name: "Utilities", percentage: 12, color: "#ef4444" },
    { name: "Others", percentage: 8, color: "#8b5cf6" }
  ];

  const topCustomers = [
    { name: "Acme Corporation", revenue: 12500, growth: 15.2 },
    { name: "Tech Solutions Ltd", revenue: 9800, growth: 8.7 },
    { name: "Global Industries", revenue: 8700, growth: -2.1 },
    { name: "Innovation Hub", revenue: 7600, growth: 22.5 },
    { name: "Digital Dynamics", revenue: 6500, growth: 12.8 }
  ];

  const productPerformance = [
    { name: "Premium Widget", sales: 1250, profit: 450 },
    { name: "Standard Package", sales: 980, profit: 320 },
    { name: "Deluxe Service", sales: 750, profit: 280 },
    { name: "Basic Plan", sales: 650, profit: 180 },
    { name: "Enterprise Suite", sales: 420, profit: 150 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const handleExportData = () => {
    console.log("Exporting analytics data...");
    toast.success("Analytics data exported successfully!");
  };

  const handleGenerateReport = () => {
    console.log("Generating analytics report...");
    toast.success("Analytics report generated successfully!");
  };

  return (
    <div className="dashboard-analytics-container">
      {/* Sidebar */}
      <div className="sidebar">
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
                if (item.name !== "Dashboard & Analytics") {
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
            <h1>Dashboard & Analytics</h1>
          </div>
          <div className="header-actions">
            <div className="date-range-picker">
              <input type="date" defaultValue="2025-12-23" className="date-input" />
              <span>-</span>
              <input type="date" defaultValue="2025-12-30" className="date-input" />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-select"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <button className="export-btn" onClick={handleExportData}>
              📊 Export Data
            </button>
            <button className="generate-btn" onClick={handleGenerateReport}>
              📄 Generate Report
            </button>
          </div>
        </div>

        {/* Analytics Content */}
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
              <div className="metric-change positive">
                {formatPercentage(analyticsData.salesGrowth)} from last month
              </div>
            </div>

            <div className="metric-card expenses">
              <div className="metric-header">
                <div className="metric-info">
                  <h3>Total Expenses</h3>
                  <div className="metric-value">{formatCurrency(analyticsData.totalExpenses)}</div>
                </div>
                <div className="metric-icon">📊</div>
              </div>
              <div className="metric-change negative">
                {formatPercentage(analyticsData.expenseGrowth)} from last month
              </div>
            </div>

            <div className="metric-card profit">
              <div className="metric-header">
                <div className="metric-info">
                  <h3>Net Profit</h3>
                  <div className="metric-value">{formatCurrency(analyticsData.netProfit)}</div>
                </div>
                <div className="metric-icon">📈</div>
              </div>
              <div className="metric-change positive">
                {formatPercentage(analyticsData.profitGrowth)} from last month
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Sales & Revenue Trends */}
            <div className="chart-container sales-trends">
              <div className="chart-header">
                <h3>Sales & Revenue Trends</h3>
              </div>
              <div className="line-chart">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line
                      key={i}
                      x1="40"
                      y1={40 + i * 32}
                      x2="380"
                      y2={40 + i * 32}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Sales line */}
                  <polyline
                    fill="none"
                    stroke="#4a9eff"
                    strokeWidth="3"
                    points={salesTrendData.map((data, index) => 
                      `${60 + index * 26},${180 - (data.sales / 1000) * 120}`
                    ).join(' ')}
                  />
                  
                  {/* Revenue line */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    points={salesTrendData.map((data, index) => 
                      `${60 + index * 26},${180 - (data.revenue / 1000) * 120}`
                    ).join(' ')}
                  />
                  
                  {/* Y-axis labels */}
                  {[300, 500, 700, 900, 1100].map((value, index) => (
                    <text
                      key={value}
                      x="35"
                      y={185 - index * 32}
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  ))}
                  
                  {/* X-axis labels */}
                  {salesTrendData.map((data, index) => (
                    <text
                      key={data.month}
                      x={60 + index * 26}
                      y="195"
                      fontSize="10"
                      fill="#6b7280"
                      textAnchor="middle"
                    >
                      {data.month}
                    </text>
                  ))}
                </svg>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color sales"></div>
                    <span>Sales</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color revenue"></div>
                    <span>Revenue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Distribution */}
            <div className="chart-container expense-distribution">
              <div className="chart-header">
                <h3>Expense Distribution by Category</h3>
              </div>
              <div className="donut-chart">
                <svg viewBox="0 0 200 200" className="donut-svg">
                  {expenseCategories.map((category, index) => {
                    const startAngle = expenseCategories.slice(0, index).reduce((sum, cat) => sum + (cat.percentage * 3.6), 0);
                    const endAngle = startAngle + (category.percentage * 3.6);
                    const largeArcFlag = category.percentage > 50 ? 1 : 0;
                    
                    const x1 = 100 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
                    const y1 = 100 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
                    const x2 = 100 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
                    const y2 = 100 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
                    
                    const pathData = [
                      "M", 100, 100,
                      "L", x1, y1,
                      "A", 60, 60, 0, largeArcFlag, 1, x2, y2,
                      "Z"
                    ].join(" ");
                    
                    return (
                      <path
                        key={category.name}
                        d={pathData}
                        fill={category.color}
                        opacity="0.8"
                      />
                    );
                  })}
                  
                  {/* Inner circle for donut effect */}
                  <circle cx="100" cy="100" r="30" fill="white" />
                </svg>
                <div className="donut-legend">
                  {expenseCategories.map(category => (
                    <div key={category.name} className="legend-item">
                      <div 
                        className="legend-color" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            {/* Top Customers */}
            <div className="list-container customers">
              <div className="list-header">
                <h3>Top Customers</h3>
              </div>
              <div className="list-content">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="list-item">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <div className="item-name">{customer.name}</div>
                      <div className="item-value">{formatCurrency(customer.revenue)}</div>
                    </div>
                    <div className={`item-growth ${customer.growth >= 0 ? 'positive' : 'negative'}`}>
                      {formatPercentage(customer.growth)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Performance */}
            <div className="list-container products">
              <div className="list-header">
                <h3>Product Performance: Profit vs. Sales</h3>
              </div>
              <div className="product-chart">
                <svg viewBox="0 0 300 200" className="scatter-chart">
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <g key={i}>
                      <line
                        x1="40"
                        y1={40 + i * 32}
                        x2="280"
                        y2={40 + i * 32}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                      <line
                        x1={40 + i * 48}
                        y1="40"
                        x2={40 + i * 48}
                        y2="168"
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                    </g>
                  ))}
                  
                  {/* Data points */}
                  {productPerformance.map((product, index) => (
                    <circle
                      key={product.name}
                      cx={40 + (product.sales / 1500) * 240}
                      cy={168 - (product.profit / 500) * 128}
                      r="6"
                      fill="#4a9eff"
                      opacity="0.8"
                    />
                  ))}
                  
                  {/* Axes labels */}
                  <text x="160" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">Sales</text>
                  <text x="20" y="104" fontSize="12" fill="#6b7280" textAnchor="middle" transform="rotate(-90 20 104)">Profit</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;