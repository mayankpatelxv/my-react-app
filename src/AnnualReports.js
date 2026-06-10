import { useState, useEffect } from "react";
import "./AnnualReports.css";
import { getSales, getPurchases } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import LoadingSkeleton from "./LoadingSkeleton";
import { useToast } from "./Toast";

const AnnualReports = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
  const toast = useToast();
  const [activeMenu, setActiveMenu] = useState("Annual Reports");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const selectedYear = new Date().getFullYear().toString();
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

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" }
  ];



  const handleExportPDF = async () => {
    try {
      // Simple text-based report export (works without additional dependencies)
      const reportContent = generateReportContent();
      
      // Create and download the report
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BizzBuddy_Annual_Report_${selectedYear}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Annual Report for ${selectedYear} exported successfully!`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error exporting report. Please try again.');
    }
  };

  const generateReportContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    return `
╔══════════════════════════════════════════════════════════════╗
║                    BIZZBUDDY ANNUAL REPORT                   ║
║                         ${selectedYear}                                ║
╚══════════════════════════════════════════════════════════════╝

Generated on: ${currentDate} at ${currentTime}
User: ${user?.name || 'Business Owner'}
Report Period: January 1, ${selectedYear} - December 31, ${selectedYear}

═══════════════════════════════════════════════════════════════
📊 EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════

Total Revenue:        ${formatCurrency(reportData.totalRevenue, false)}
Total Expenses:       ${formatCurrency(reportData.totalExpenses, false)}
Net Profit:           ${formatCurrency(reportData.netProfit, false)}
Profit Margin:        ${reportData.profitMargin.toFixed(1)}%

Business Status:      ${reportData.netProfit >= 0 ? '✅ PROFITABLE' : '⚠️  LOSS-MAKING'}
Financial Health:     ${reportData.profitMargin > 20 ? 'Excellent' : reportData.profitMargin > 10 ? 'Good' : reportData.profitMargin > 0 ? 'Fair' : 'Needs Improvement'}

═══════════════════════════════════════════════════════════════
👥 TOP CUSTOMERS (by Revenue)
═══════════════════════════════════════════════════════════════

${topCustomers.length > 0 ? 
  topCustomers.map((customer, index) => 
    `${(index + 1).toString().padStart(2, '0')}. ${customer.name.padEnd(30)} $${customer.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`
  ).join('\n') : 
  'No customer data available for this period.'
}

═══════════════════════════════════════════════════════════════
🏭 TOP SUPPLIERS (by Purchase Volume)
═══════════════════════════════════════════════════════════════

${topSuppliers.length > 0 ? 
  topSuppliers.map((supplier, index) => 
    `${(index + 1).toString().padStart(2, '0')}. ${supplier.name.padEnd(30)} $${supplier.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}`
  ).join('\n') : 
  'No supplier data available for this period.'
}

═══════════════════════════════════════════════════════════════
📈 MONTHLY PERFORMANCE BREAKDOWN
═══════════════════════════════════════════════════════════════

Month    Sales Revenue    Purchases       Net Profit
─────────────────────────────────────────────────────────────
${monthlyData.map(data => {
  const monthProfit = data.sales - data.purchases;
  return `${data.month.padEnd(8)} $${data.sales.toLocaleString('en-US', {minimumFractionDigits: 0}).padStart(12)} $${data.purchases.toLocaleString('en-US', {minimumFractionDigits: 0}).padStart(12)} $${monthProfit.toLocaleString('en-US', {minimumFractionDigits: 0}).padStart(12)}`;
}).join('\n')}

═══════════════════════════════════════════════════════════════
💡 BUSINESS INSIGHTS & RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

Financial Performance:
• ${reportData.netProfit >= 0 ? 
    `Your business generated a profit of $${reportData.netProfit.toLocaleString('en-US', {minimumFractionDigits: 2})} this year.` : 
    `Your business had a loss of $${Math.abs(reportData.netProfit).toLocaleString('en-US', {minimumFractionDigits: 2})} this year.`
  }

• Profit margin of ${reportData.profitMargin.toFixed(1)}% ${
    reportData.profitMargin > 15 ? 'is excellent and above industry average.' :
    reportData.profitMargin > 5 ? 'is healthy but has room for improvement.' :
    reportData.profitMargin > 0 ? 'is low and needs attention.' :
    'indicates losses that require immediate action.'
  }

Customer Analysis:
• ${topCustomers.length > 0 ? 
    `Your top customer "${topCustomers[0].name}" contributed $${topCustomers[0].revenue.toLocaleString('en-US', {minimumFractionDigits: 2})} (${((topCustomers[0].revenue / reportData.totalRevenue) * 100).toFixed(1)}% of total revenue).` :
    'Focus on acquiring and retaining customers to grow your business.'
  }

Supplier Analysis:
• ${topSuppliers.length > 0 ? 
    `Your largest supplier "${topSuppliers[0].name}" accounts for $${topSuppliers[0].amount.toLocaleString('en-US', {minimumFractionDigits: 2})} in purchases.` :
    'Consider establishing relationships with reliable suppliers.'
  }

Recommendations:
${reportData.profitMargin < 10 ? '• Focus on reducing costs and improving operational efficiency.' : ''}
${reportData.totalRevenue < reportData.totalExpenses ? '• Increase sales efforts and review pricing strategy.' : ''}
${topCustomers.length < 3 ? '• Diversify your customer base to reduce dependency risk.' : ''}
• Continue monitoring monthly performance trends.
• Consider seasonal patterns in your business planning.

═══════════════════════════════════════════════════════════════
📋 REPORT METADATA
═══════════════════════════════════════════════════════════════

Report Generated By:  BizzBuddy Business Management System
Data Source:          Live Database Records
Report Type:          Annual Financial Summary
Export Format:        Text Document (.txt)
File Generated:       ${currentDate} ${currentTime}

For questions about this report, please contact your system administrator.

═══════════════════════════════════════════════════════════════
End of Report
═══════════════════════════════════════════════════════════════
    `.trim();
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
              className={`menu-item ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => {
                setActiveMenu(item.key);
                setIsMobileMenuOpen(false);
                if (item.key !== "Annual Reports") {
                  onNavigate(item.key);
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
            <h1>Annual Reports</h1>
          </div>
          <div className="header-actions">
            <button className="export-btn" onClick={handleExportPDF}>
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Reports Content */}
        <div className="reports-content">
          {loading ? (
            <div className="loading-skeleton-container">
              <LoadingSkeleton type="dashboard" />
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
            </div>

            <div className="metric-card expenses">
              <div className="metric-header">
                <h3>Total Expenses</h3>
                <span className="metric-icon">📊</span>
              </div>
              <div className="metric-value">{formatCurrency(reportData.totalExpenses)}</div>
            </div>

            <div className="metric-card profit">
              <div className="metric-header">
                <h3>Net Profit</h3>
                <span className="metric-icon">📈</span>
              </div>
              <div className="metric-value">{formatCurrency(reportData.netProfit)}</div>
            </div>

            <div className="metric-card margin">
              <div className="metric-header">
                <h3>Profit Margin</h3>
                <span className="metric-icon">📋</span>
              </div>
              <div className="metric-value">{reportData.profitMargin.toFixed(2)}%</div>
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

          {/* ── CHARTS ROW ── */}
          <div className="extra-charts-row">

            {/* 2D Line Graph — Monthly Revenue vs Expenses */}
            <div className="extra-chart-card">
              <h3 className="extra-chart-title">📈 Monthly Revenue vs Expenses</h3>
              {(() => {
                const W = 420, H = 200, padL = 48, padB = 28, padT = 16, padR = 16;
                const innerW = W - padL - padR;
                const innerH = H - padT - padB;
                const maxVal = Math.max(...monthlyData.map(d => Math.max(d.sales, d.purchases)), 1);
                const xStep = innerW / (monthlyData.length - 1 || 1);
                const toX = i => padL + i * xStep;
                const toY = v => padT + innerH - (v / maxVal) * innerH;
                const salesPts = monthlyData.map((d, i) => `${toX(i)},${toY(d.sales)}`).join(' ');
                const purchPts = monthlyData.map((d, i) => `${toX(i)},${toY(d.purchases)}`).join(' ');
                const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(maxVal * f));
                return (
                  <svg viewBox={`0 0 ${W} ${H}`} className="line-chart-svg">
                    {/* grid */}
                    {gridLines.map(v => (
                      <g key={v}>
                        <line x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)} stroke="#e5e7eb" strokeWidth="1"/>
                        <text x={padL - 4} y={toY(v) + 4} fontSize="9" fill="#9ca3af" textAnchor="end">
                          {v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                        </text>
                      </g>
                    ))}
                    {/* area fills */}
                    <polygon
                      points={`${padL},${padT + innerH} ${salesPts} ${W - padR},${padT + innerH}`}
                      fill="rgba(74,158,255,0.12)"
                    />
                    <polygon
                      points={`${padL},${padT + innerH} ${purchPts} ${W - padR},${padT + innerH}`}
                      fill="rgba(245,158,11,0.12)"
                    />
                    {/* lines */}
                    <polyline fill="none" stroke="#4a9eff" strokeWidth="2.5" strokeLinejoin="round" points={salesPts}/>
                    <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" points={purchPts}/>
                    {/* dots */}
                    {monthlyData.map((d, i) => (
                      <g key={d.month}>
                        <circle cx={toX(i)} cy={toY(d.sales)} r="3.5" fill="#4a9eff"/>
                        <circle cx={toX(i)} cy={toY(d.purchases)} r="3.5" fill="#f59e0b"/>
                        <text x={toX(i)} y={H - 4} fontSize="9" fill="#6b7280" textAnchor="middle">{d.month}</text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
              <div className="extra-chart-legend">
                <span className="ecl-dot" style={{ background: '#4a9eff' }}/><span>Revenue</span>
                <span className="ecl-dot" style={{ background: '#f59e0b' }}/><span>Expenses</span>
              </div>
            </div>

            {/* Pie Chart — Customer Revenue Share */}
            <div className="extra-chart-card">
              <h3 className="extra-chart-title">🥧 Customer Revenue Share</h3>
              {(() => {
                const PIE_COLORS = ['#4a9eff','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'];
                const total = topCustomers.reduce((s, c) => s + c.revenue, 0) || 0;
                const cx = 110, cy = 110, R = 80, innerR = 46;

                if (total === 0) {
                  return (
                    <div className="pie-empty">
                      <svg viewBox="0 0 220 220" className="donut-svg-main">
                        <circle cx={cx} cy={cy} r={R} fill="#f3f4f6"/>
                        <circle cx={cx} cy={cy} r={innerR} fill="white"/>
                        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fill="#9ca3af">No data</text>
                      </svg>
                    </div>
                  );
                }

                let cumAngle = -Math.PI / 2;
                const slices = topCustomers.map((c, i) => {
                  const angle = (c.revenue / total) * 2 * Math.PI;
                  const startA = cumAngle;
                  cumAngle += angle;
                  const endA = cumAngle;
                  const x1 = cx + R * Math.cos(startA);
                  const y1 = cy + R * Math.sin(startA);
                  const x2 = cx + R * Math.cos(endA);
                  const y2 = cy + R * Math.sin(endA);
                  const ix1 = cx + innerR * Math.cos(endA);
                  const iy1 = cy + innerR * Math.sin(endA);
                  const ix2 = cx + innerR * Math.cos(startA);
                  const iy2 = cy + innerR * Math.sin(startA);
                  const large = angle > Math.PI ? 1 : 0;
                  const midA = startA + angle / 2;
                  const labelR = R * 0.68;
                  const lx = cx + labelR * Math.cos(midA);
                  const ly = cy + labelR * Math.sin(midA);
                  const pct = (c.revenue / total) * 100;
                  return {
                    d: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large},0 ${ix2},${iy2} Z`,
                    color: PIE_COLORS[i % PIE_COLORS.length],
                    name: c.name, revenue: c.revenue,
                    pct: pct.toFixed(1), lx, ly, showLabel: pct >= 5
                  };
                });

                return (
                  <div className="donut-layout">
                    <svg viewBox="0 0 220 220" className="donut-svg-main">
                      <defs>
                        {slices.map((s, i) => (
                          <filter key={i} id={`shadow-${i}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={s.color} floodOpacity="0.35"/>
                          </filter>
                        ))}
                      </defs>
                      {slices.map((s, i) => (
                        <path key={i} d={s.d} fill={s.color}
                          stroke="white" strokeWidth="2"
                          filter={`url(#shadow-${i})`}
                          className="donut-slice"
                        />
                      ))}
                      {/* center hole label */}
                      <circle cx={cx} cy={cy} r={innerR - 2} fill="white"/>
                      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="500">Total</text>
                      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fill="#1f2937" fontWeight="800">
                        {topCustomers.length}
                      </text>
                      <text x={cx} y={cy + 24} textAnchor="middle" fontSize="9" fill="#9ca3af">customers</text>
                      {/* slice % labels */}
                      {slices.filter(s => s.showLabel).map((s, i) => (
                        <text key={i} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle"
                          fontSize="9" fontWeight="700" fill="white">
                          {s.pct}%
                        </text>
                      ))}
                    </svg>

                    <div className="donut-legend-grid">
                      {slices.map((s, i) => (
                        <div key={i} className="donut-legend-item">
                          <span className="donut-legend-dot" style={{ background: s.color }}/>
                          <div className="donut-legend-text">
                            <span className="donut-legend-name">{s.name}</span>
                            <span className="donut-legend-val">{s.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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