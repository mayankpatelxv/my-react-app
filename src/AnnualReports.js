import { useState, useEffect } from "react";
import "./AnnualReports.css";
import AnalyticsReport from "./AnalyticsReport";
import { getSales, getPurchases } from "./supabaseClient";

const AnnualReports = ({ user, onLogout, onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState("Annual Reports");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showAnalyticsReport, setShowAnalyticsReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    revenueGrowth: 0,
    expenseGrowth: 0,
    profitGrowth: 0,
    marginGrowth: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [user, selectedYear]);

  const fetchReportData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [salesResult, purchasesResult] = await Promise.all([
        getSales(user.id),
        getPurchases(user.id)
      ]);

      let totalRevenue = 0;
      let totalExpenses = 0;
      let customerSales = {};
      let supplierPurchases = {};
      let monthlyStats = {};

      // Process sales data
      if (salesResult.success && salesResult.data) {
        salesResult.data.forEach(sale => {
          totalRevenue += sale.total_amount || 0;
          
          // Group by customer
          const customer = sale.customer_name;
          if (!customerSales[customer]) {
            customerSales[customer] = { name: customer, revenue: 0, growth: 0 };
          }
          customerSales[customer].revenue += sale.total_amount || 0;

          // Group by month
          const saleDate = new Date(sale.invoice_date || sale.created_at);
          const monthKey = saleDate.toLocaleString('default', { month: 'short' });
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { month: monthKey, sales: 0, purchases: 0, expenses: 0 };
          }
          monthlyStats[monthKey].sales += sale.total_amount || 0;
        });
      }

      // Process purchases data
      if (purchasesResult.success && purchasesResult.data) {
        purchasesResult.data.forEach(purchase => {
          totalExpenses += purchase.total_amount || 0;
          
          // Group by supplier
          const supplier = purchase.supplier_name;
          if (!supplierPurchases[supplier]) {
            supplierPurchases[supplier] = { name: supplier, amount: 0, growth: 0 };
          }
          supplierPurchases[supplier].amount += purchase.total_amount || 0;

          // Group by month
          const purchaseDate = new Date(purchase.purchase_date || purchase.created_at);
          const monthKey = purchaseDate.toLocaleString('default', { month: 'short' });
          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = { month: monthKey, sales: 0, purchases: 0, expenses: 0 };
          }
          monthlyStats[monthKey].purchases += purchase.total_amount || 0;
          monthlyStats[monthKey].expenses += purchase.total_amount || 0;
        });
      }

      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      setReportData({
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        revenueGrowth: 0, // Would need historical data
        expenseGrowth: 0, // Would need historical data
        profitGrowth: 0, // Would need historical data
        marginGrowth: 0 // Would need historical data
      });

      // Convert to arrays and sort
      const topCustomersList = Object.values(customerSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const topSuppliersList = Object.values(supplierPurchases)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Create monthly data array
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyDataArray = monthNames.map(month => 
        monthlyStats[month] || { month, sales: 0, purchases: 0, expenses: 0 }
      );

      setTopCustomers(topCustomersList);
      setTopSuppliers(topSuppliersList);
      setMonthlyData(monthlyDataArray);

    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // If Analytics Report is active, show that component
  if (showAnalyticsReport) {
    return <AnalyticsReport onBack={() => setShowAnalyticsReport(false)} user={user} />;
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

  // Remove the sample data - now using real data from state

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
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">⏳</div>
              <h3>Loading Annual Reports...</h3>
              <p>Please wait while we fetch your data for {selectedYear}.</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnualReports;