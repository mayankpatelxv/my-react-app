import { useState, useEffect } from "react";
import "./DemandForecasting.css";
import { getSales, getItems } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import UserMenu from "./UserMenu";

const DemandForecasting = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText } = useSettings();
  const [activeMenu, setActiveMenu] = useState("Demand Forecasting");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [forecastPeriod, setForecastPeriod] = useState(30); // days
  const [forecast, setForecast] = useState(null);
  const [isForecasting, setIsForecasting] = useState(false);

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" },
    { name: "Demand Forecasting", icon: "🔮", key: "Demand Forecasting" }
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [salesResult, itemsResult] = await Promise.all([
        getSales(user.id),
        getItems(user.id)
      ]);

      if (salesResult.success) {
        setSalesData(salesResult.data || []);
      }

      if (itemsResult.success) {
        setItems(itemsResult.data || []);
        if (itemsResult.data?.length > 0) {
          setSelectedItem(itemsResult.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Simple Moving Average Forecasting Model
  const generateForecast = () => {
    if (!selectedItem || salesData.length === 0) return;

    setIsForecasting(true);

    try {
      // Filter sales data for selected item
      const itemSales = salesData.filter(sale => 
        sale.items && sale.items.some(item => item.item_id === selectedItem)
      );

      if (itemSales.length < 3) {
        setForecast({
          error: "Insufficient data for forecasting. Need at least 3 sales records.",
          predictions: [],
          accuracy: 0,
          trend: "insufficient_data"
        });
        setIsForecasting(false);
        return;
      }

      // Prepare time series data
      const timeSeriesData = prepareTimeSeriesData(itemSales, selectedItem);
      
      // Apply forecasting algorithm
      const predictions = simpleMovingAverageForecasting(timeSeriesData, forecastPeriod);
      
      // Calculate trend and accuracy
      const trend = calculateTrend(timeSeriesData);
      const accuracy = calculateAccuracy(timeSeriesData);

      setForecast({
        predictions,
        accuracy,
        trend,
        historicalData: timeSeriesData,
        selectedItemName: items.find(item => item.id === selectedItem)?.name || "Unknown Item"
      });

    } catch (error) {
      console.error("Forecasting error:", error);
      setForecast({
        error: "Error generating forecast. Please try again.",
        predictions: [],
        accuracy: 0,
        trend: "error"
      });
    } finally {
      setIsForecasting(false);
    }
  };

  // Prepare time series data from sales
  const prepareTimeSeriesData = (itemSales, itemId) => {
    const dailyDemand = {};

    itemSales.forEach(sale => {
      const date = new Date(sale.created_at).toISOString().split('T')[0];
      const itemInSale = sale.items.find(item => item.item_id === itemId);
      
      if (itemInSale) {
        if (!dailyDemand[date]) {
          dailyDemand[date] = 0;
        }
        dailyDemand[date] += itemInSale.quantity || 0;
      }
    });

    // Convert to array and sort by date
    const timeSeriesArray = Object.entries(dailyDemand)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Fill missing days with 0
    const filledData = fillMissingDays(timeSeriesArray);
    
    return filledData;
  };

  // Fill missing days with 0 demand
  const fillMissingDays = (data) => {
    if (data.length === 0) return [];

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    const filledData = [];
    
    const dataMap = {};
    data.forEach(item => {
      dataMap[item.date] = item.quantity;
    });

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      filledData.push({
        date: dateStr,
        quantity: dataMap[dateStr] || 0
      });
    }

    return filledData;
  };

  // Simple Moving Average Forecasting
  const simpleMovingAverageForecasting = (data, forecastDays) => {
    if (data.length < 3) return [];

    const windowSize = Math.min(7, Math.floor(data.length / 2)); // 7-day moving average or half the data
    const predictions = [];
    
    // Calculate moving average for the last window
    const recentData = data.slice(-windowSize);
    const movingAverage = recentData.reduce((sum, item) => sum + item.quantity, 0) / windowSize;
    
    // Apply trend adjustment
    const trend = calculateSimpleTrend(data);
    
    // Generate predictions
    const lastDate = new Date(data[data.length - 1].date);
    
    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(forecastDate.getDate() + i);
      
      // Apply trend and some randomness for realistic forecasting
      const trendAdjustment = trend * i * 0.1; // Gradual trend application
      const seasonalFactor = 1 + 0.1 * Math.sin((i / 7) * 2 * Math.PI); // Weekly seasonality
      
      let predictedQuantity = (movingAverage + trendAdjustment) * seasonalFactor;
      predictedQuantity = Math.max(0, Math.round(predictedQuantity * 100) / 100); // Round to 2 decimals, min 0
      
      predictions.push({
        date: forecastDate.toISOString().split('T')[0],
        quantity: predictedQuantity,
        confidence: Math.max(0.5, 0.9 - (i / forecastDays) * 0.4) // Decreasing confidence over time
      });
    }

    return predictions;
  };

  // Calculate simple trend
  const calculateSimpleTrend = (data) => {
    if (data.length < 2) return 0;
    
    const recentPeriod = Math.min(14, data.length); // Last 14 days or all data
    const recentData = data.slice(-recentPeriod);
    
    const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
    const secondHalf = recentData.slice(Math.floor(recentData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.quantity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.quantity, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  };

  // Calculate trend direction
  const calculateTrend = (data) => {
    const trend = calculateSimpleTrend(data);
    if (trend > 0.5) return "increasing";
    if (trend < -0.5) return "decreasing";
    return "stable";
  };

  // Calculate model accuracy (simplified)
  const calculateAccuracy = (data) => {
    if (data.length < 7) return 0.7; // Default for small datasets
    
    // Calculate coefficient of variation (lower = more predictable = higher accuracy)
    const quantities = data.map(item => item.quantity);
    const mean = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
    const variance = quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length;
    const stdDev = Math.sqrt(variance);
    
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;
    
    // Convert to accuracy percentage (inverse relationship)
    const accuracy = Math.max(0.5, Math.min(0.95, 1 - coefficientOfVariation));
    
    return Math.round(accuracy * 100) / 100;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "increasing": return "📈";
      case "decreasing": return "📉";
      case "stable": return "➡️";
      default: return "❓";
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "increasing": return "#10b981";
      case "decreasing": return "#ef4444";
      case "stable": return "#6b7280";
      default: return "#6b7280";
    }
  };

  return (
    <div className="demand-forecasting-container">
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
                if (item.key !== "Demand Forecasting") {
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
          <div className="header-left">
            <h1>🔮 Demand Forecasting</h1>
            <p>AI-powered demand prediction for your inventory</p>
          </div>
          <div className="header-actions">
            <UserMenu user={user} onLogout={onLogout} onNavigate={onNavigate} />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">⏳</div>
            <p>Loading sales data...</p>
          </div>
        ) : (
          <>
            {/* Forecasting Controls */}
            <div className="forecasting-controls">
              <div className="control-group">
                <label htmlFor="item-select">Select Item:</label>
                <select
                  id="item-select"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="item-select"
                >
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {formatCurrency(item.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="forecast-period">Forecast Period (days):</label>
                <select
                  id="forecast-period"
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
                  className="period-select"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              <button
                className="generate-forecast-btn"
                onClick={generateForecast}
                disabled={isForecasting || !selectedItem}
              >
                {isForecasting ? "🔄 Generating..." : "🔮 Generate Forecast"}
              </button>
            </div>

            {/* Forecast Results */}
            {forecast && (
              <div className="forecast-results">
                {forecast.error ? (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{forecast.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Forecast Summary */}
                    <div className="forecast-summary">
                      <div className="summary-card">
                        <div className="summary-header">
                          <h3>📊 Forecast Summary</h3>
                          <span className="item-name">{forecast.selectedItemName}</span>
                        </div>
                        
                        <div className="summary-stats">
                          <div className="stat-item">
                            <span className="stat-label">Trend</span>
                            <span className="stat-value" style={{ color: getTrendColor(forecast.trend) }}>
                              {getTrendIcon(forecast.trend)} {forecast.trend}
                            </span>
                          </div>
                          
                          <div className="stat-item">
                            <span className="stat-label">Model Accuracy</span>
                            <span className="stat-value">
                              {Math.round(forecast.accuracy * 100)}%
                            </span>
                          </div>
                          
                          <div className="stat-item">
                            <span className="stat-label">Total Predicted Demand</span>
                            <span className="stat-value">
                              {Math.round(forecast.predictions.reduce((sum, p) => sum + p.quantity, 0))} units
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Forecast Chart */}
                    <div className="forecast-chart">
                      <h3>📈 Demand Forecast Chart</h3>
                      <div className="chart-container">
                        <div className="chart-legend">
                          <div className="legend-item">
                            <span className="legend-color historical"></span>
                            <span>Historical Data</span>
                          </div>
                          <div className="legend-item">
                            <span className="legend-color predicted"></span>
                            <span>Predicted Demand</span>
                          </div>
                        </div>
                        
                        <div className="chart-bars">
                          {/* Historical Data */}
                          {forecast.historicalData.slice(-14).map((item, index) => (
                            <div key={`hist-${index}`} className="chart-bar-group">
                              <div className="bar-date">{new Date(item.date).toLocaleDateString()}</div>
                              <div className="bar-container">
                                <div 
                                  className="chart-bar historical"
                                  style={{ 
                                    height: `${Math.max(5, (item.quantity / Math.max(...forecast.historicalData.map(d => d.quantity), 1)) * 100)}px` 
                                  }}
                                ></div>
                              </div>
                              <div className="bar-value">{item.quantity}</div>
                            </div>
                          ))}
                          
                          {/* Predicted Data */}
                          {forecast.predictions.slice(0, 14).map((item, index) => (
                            <div key={`pred-${index}`} className="chart-bar-group">
                              <div className="bar-date">{new Date(item.date).toLocaleDateString()}</div>
                              <div className="bar-container">
                                <div 
                                  className="chart-bar predicted"
                                  style={{ 
                                    height: `${Math.max(5, (item.quantity / Math.max(...forecast.predictions.map(d => d.quantity), 1)) * 100)}px`,
                                    opacity: item.confidence
                                  }}
                                ></div>
                              </div>
                              <div className="bar-value">{item.quantity.toFixed(1)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Forecast Table */}
                    <div className="forecast-table">
                      <h3>📋 Detailed Predictions</h3>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Predicted Demand</th>
                              <th>Confidence</th>
                              <th>Recommendation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {forecast.predictions.slice(0, 10).map((prediction, index) => (
                              <tr key={index}>
                                <td>{new Date(prediction.date).toLocaleDateString()}</td>
                                <td>{prediction.quantity.toFixed(1)} units</td>
                                <td>
                                  <span className={`confidence ${prediction.confidence > 0.7 ? 'high' : prediction.confidence > 0.5 ? 'medium' : 'low'}`}>
                                    {Math.round(prediction.confidence * 100)}%
                                  </span>
                                </td>
                                <td>
                                  {prediction.quantity > 5 ? "🟢 Stock up" : 
                                   prediction.quantity > 2 ? "🟡 Monitor" : "🔴 Low demand"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Business Insights */}
                    <div className="business-insights">
                      <h3>💡 Business Insights</h3>
                      <div className="insights-grid">
                        <div className="insight-card">
                          <div className="insight-icon">📦</div>
                          <div className="insight-content">
                            <h4>Inventory Recommendation</h4>
                            <p>
                              {forecast.trend === "increasing" 
                                ? "Demand is growing! Consider increasing stock levels by 20-30%."
                                : forecast.trend === "decreasing"
                                ? "Demand is declining. Avoid overstocking and consider promotions."
                                : "Demand is stable. Maintain current stock levels."}
                            </p>
                          </div>
                        </div>

                        <div className="insight-card">
                          <div className="insight-icon">💰</div>
                          <div className="insight-content">
                            <h4>Revenue Opportunity</h4>
                            <p>
                              Predicted revenue for next {forecastPeriod} days: {" "}
                              {formatCurrency(
                                forecast.predictions.reduce((sum, p) => sum + p.quantity, 0) * 
                                (items.find(item => item.id === selectedItem)?.price || 0)
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="insight-card">
                          <div className="insight-icon">⚡</div>
                          <div className="insight-content">
                            <h4>Action Items</h4>
                            <p>
                              {forecast.accuracy > 0.8 
                                ? "High confidence forecast - safe to make purchasing decisions."
                                : "Moderate confidence - monitor actual sales and adjust accordingly."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Getting Started */}
            {!forecast && items.length === 0 && (
              <div className="getting-started">
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No Items Found</h3>
                  <p>Add items to your inventory to start forecasting demand.</p>
                  <button 
                    className="add-items-btn"
                    onClick={() => onNavigate("Item Management")}
                  >
                    Add Items
                  </button>
                </div>
              </div>
            )}

            {!forecast && items.length > 0 && salesData.length === 0 && (
              <div className="getting-started">
                <div className="empty-state">
                  <div className="empty-icon">🛒</div>
                  <h3>No Sales Data</h3>
                  <p>Record some sales to generate demand forecasts.</p>
                  <button 
                    className="add-sales-btn"
                    onClick={() => onNavigate("Sales")}
                  >
                    Record Sales
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DemandForecasting;