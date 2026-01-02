import React, { useState } from 'react';
import './AnalyticsReport.css';

const AnalyticsReport = ({ onBack }) => {
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [location, setLocation] = useState('All Locations');

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 450, revenue: 520 },
    { month: 'Feb', sales: 380, revenue: 480 },
    { month: 'Mar', sales: 420, revenue: 550 },
    { month: 'Apr', sales: 680, revenue: 720 },
    { month: 'May', sales: 620, revenue: 680 },
    { month: 'Jun', sales: 750, revenue: 800 },
    { month: 'Jul', sales: 720, revenue: 780 },
    { month: 'Aug', sales: 850, revenue: 900 },
    { month: 'Sep', sales: 780, revenue: 820 },
    { month: 'Oct', sales: 920, revenue: 980 },
    { month: 'Nov', sales: 880, revenue: 950 },
    { month: 'Dec', sales: 1000, revenue: 1100 }
  ];

  const expenseCategories = [
    { name: 'Marketing', value: 35, color: '#3B82F6' },
    { name: 'Operations', value: 25, color: '#10B981' },
    { name: 'Salaries', value: 20, color: '#F59E0B' },
    { name: 'Utilities', value: 12, color: '#EF4444' },
    { name: 'Others', value: 8, color: '#8B5CF6' }
  ];

  const topCustomers = [
    { name: 'Acme Corporation', revenue: '$12,450', growth: '+15.2%', positive: true },
    { name: 'Tech Solutions Ltd', revenue: '$8,920', growth: '+8.7%', positive: true },
    { name: 'Global Industries', revenue: '$7,650', growth: '-2.1%', positive: false },
    { name: 'Innovation Hub', revenue: '$6,340', growth: '+22.5%', positive: true },
    { name: 'Digital Dynamics', revenue: '$5,890', growth: '+11.3%', positive: true }
  ];

  const productPerformance = [
    { name: 'Premium Widget', profit: 85, sales: 92 },
    { name: 'Standard Package', profit: 65, sales: 78 },
    { name: 'Deluxe Service', profit: 78, sales: 85 },
    { name: 'Basic Plan', profit: 45, sales: 65 },
    { name: 'Enterprise Suite', profit: 95, sales: 88 }
  ];

  // Generate SVG path for line chart
  const generatePath = (data, key, maxValue) => {
    const width = 400;
    const height = 200;
    const padding = 40;
    
    const points = data.map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((item[key] / maxValue) * (height - 2 * padding));
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const maxValue = Math.max(...salesData.map(d => Math.max(d.sales, d.revenue)));

  // Generate donut chart paths
  const generateDonutPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
    const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="analytics-report">
      <div className="analytics-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back to Annual Reports
          </button>
          <h1>Dashboard & Analytics</h1>
        </div>
        
        <div className="header-controls">
          <div className="date-picker">
            <input type="date" defaultValue="2025-12-23" />
            <span>-</span>
            <input type="date" defaultValue="2025-12-30" />
          </div>
          
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
          
          <select 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="filter-select"
          >
            <option>All Locations</option>
            <option>New York</option>
            <option>Los Angeles</option>
            <option>Chicago</option>
          </select>
          
          <button className="export-btn">📥 Export Data</button>
          <button className="generate-btn">📊 Generate Report</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card sales">
          <div className="metric-header">
            <span className="metric-label">Total Sales</span>
            <span className="metric-icon">💰</span>
          </div>
          <div className="metric-value">$45,231.89</div>
          <div className="metric-change positive">📈 +20.1% from last month</div>
        </div>
        
        <div className="metric-card expenses">
          <div className="metric-header">
            <span className="metric-label">Total Expenses</span>
            <span className="metric-icon">💸</span>
          </div>
          <div className="metric-value">$15,100.00</div>
          <div className="metric-change negative">📉 -3.2% from last month</div>
        </div>
        
        <div className="metric-card profit">
          <div className="metric-header">
            <span className="metric-label">Net Profit</span>
            <span className="metric-icon">⚡</span>
          </div>
          <div className="metric-value">$30,131.89</div>
          <div className="metric-change positive">📈 +18.8% from last month</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Sales & Revenue Trends</h3>
          <div className="line-chart">
            <svg width="100%" height="250" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <line 
                  key={i} 
                  x1="40" 
                  y1={40 + i * 32} 
                  x2="360" 
                  y2={40 + i * 32} 
                  stroke="#e5e7eb" 
                  strokeWidth="1"
                />
              ))}
              
              {/* Sales line */}
              <path
                d={generatePath(salesData, 'sales', maxValue)}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className="chart-line"
              />
              
              {/* Revenue line */}
              <path
                d={generatePath(salesData, 'revenue', maxValue)}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                className="chart-line"
              />
              
              {/* Data points */}
              {salesData.map((item, index) => {
                const x = 40 + (index * 320) / (salesData.length - 1);
                const salesY = 160 - ((item.sales / maxValue) * 120);
                const revenueY = 160 - ((item.revenue / maxValue) * 120);
                
                return (
                  <g key={index}>
                    <circle cx={x} cy={salesY} r="4" fill="#3B82F6" className="data-point" />
                    <circle cx={x} cy={revenueY} r="4" fill="#F59E0B" className="data-point" />
                  </g>
                );
              })}
            </svg>
            
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#3B82F6'}}></span>
                <span>Sales</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{backgroundColor: '#F59E0B'}}></span>
                <span>Revenue</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>Expense Distribution by Category</h3>
          <div className="donut-chart">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {expenseCategories.map((category, index) => {
                const total = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);
                const startAngle = expenseCategories.slice(0, index).reduce((sum, cat) => sum + (cat.value / total) * 360, 0);
                const endAngle = startAngle + (category.value / total) * 360;
                
                return (
                  <path
                    key={category.name}
                    d={generateDonutPath(startAngle, endAngle, 60, 90)}
                    fill={category.color}
                    className="donut-segment"
                  />
                );
              })}
            </svg>
            
            <div className="donut-legend">
              {expenseCategories.map(category => (
                <div key={category.name} className="legend-item">
                  <span className="legend-color" style={{backgroundColor: category.color}}></span>
                  <span>{category.name}</span>
                  <span className="legend-value">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="data-tables">
        <div className="table-container">
          <h3>Top Customers</h3>
          <div className="data-table">
            {topCustomers.map((customer, index) => (
              <div key={customer.name} className="table-row">
                <div className="customer-rank">#{index + 1}</div>
                <div className="customer-info">
                  <div className="customer-name">{customer.name}</div>
                  <div className="customer-revenue">{customer.revenue}</div>
                </div>
                <div className={`customer-growth ${customer.positive ? 'positive' : 'negative'}`}>
                  {customer.growth}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-container">
          <h3>Product Performance: Profit vs. Sales</h3>
          <div className="scatter-chart">
            <svg width="100%" height="200" viewBox="0 0 300 200">
              {/* Grid */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <line x1="40" y1={40 + i * 32} x2="260" y2={40 + i * 32} stroke="#e5e7eb" strokeWidth="1"/>
                  <line x1={40 + i * 44} y1="40" x2={40 + i * 44} y2="160" stroke="#e5e7eb" strokeWidth="1"/>
                </g>
              ))}
              
              {/* Data points */}
              {productPerformance.map((product, index) => (
                <circle
                  key={product.name}
                  cx={40 + (product.sales / 100) * 220}
                  cy={160 - (product.profit / 100) * 120}
                  r="6"
                  fill="#10B981"
                  className="scatter-point"
                  title={product.name}
                />
              ))}
            </svg>
          </div>
          
          <div className="product-list">
            {productPerformance.map(product => (
              <div key={product.name} className="product-item">
                <span className="product-name">{product.name}</span>
                <span className="product-metrics">
                  Profit: {product.profit}% | Sales: {product.sales}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReport;