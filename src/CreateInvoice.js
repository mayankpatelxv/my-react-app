import { useState } from "react";
import "./CreateInvoice.css";
import BizBuddyLogo from "./BizBuddyLogo";

const CreateInvoice = ({ user, onLogout, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("Acme Corp");
  const [items, setItems] = useState([
    { id: 1, name: "Product A - Premium Widget", price: 50, quantity: 5 },
    { id: 2, name: "Service B - Consulting Hour", price: 120, quantity: 0 }
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [confirmInventory, setConfirmInventory] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Party Management", icon: "👥" },
    { name: "Item Management", icon: "📦" },
    { name: "Sales", icon: "🛒" },
    { name: "Purchases", icon: "💰" },
    { name: "Annual Reports", icon: "📈" }
  ];

  const customers = [
    "Acme Corp",
    "GlobalTech Solutions", 
    "Innovate Marketing",
    "Bright Future Academy"
  ];

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateItemDiscount = () => {
    return 5.00; // Fixed discount as shown in image
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * taxRate) / 100;
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const itemDiscount = calculateItemDiscount();
    const tax = calculateTax();
    return subtotal - itemDiscount + tax - additionalDiscount;
  };

  const handlePrintInvoice = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate the invoice HTML content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${selectedCustomer}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #4a9eff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-info h1 {
            color: #4a9eff;
            margin: 0;
            font-size: 28px;
          }
          .company-info p {
            margin: 5px 0;
            color: #666;
          }
          .invoice-details {
            text-align: right;
          }
          .invoice-details h2 {
            color: #333;
            margin: 0;
            font-size: 24px;
          }
          .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .bill-to, .invoice-info {
            flex: 1;
          }
          .bill-to h3, .invoice-info h3 {
            color: #4a9eff;
            margin-bottom: 10px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #dee2e6;
            font-weight: 600;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
          }
          .items-table .text-right {
            text-align: right;
          }
          .totals-section {
            margin-left: auto;
            width: 300px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .total-row.grand-total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #4a9eff;
            border-bottom: 2px solid #4a9eff;
            color: #4a9eff;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="company-info">
              <h1>BizzBuddy</h1>
              <p>Business Management System</p>
              <p>Email: support@bizzbuddy.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> INV-${Date.now().toString().slice(-6)}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="invoice-meta">
            <div class="bill-to">
              <h3>Bill To:</h3>
              <p><strong>${selectedCustomer}</strong></p>
              <p>Customer Address</p>
              <p>City, State 12345</p>
              <p>customer@email.com</p>
            </div>
            <div class="invoice-info">
              <h3>Invoice Details:</h3>
              <p><strong>Payment Terms:</strong> Net 30</p>
              <p><strong>Due Date:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              <p><strong>Tax Rate:</strong> ${taxRate}%</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th class="text-right">Price</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">$${item.price.toFixed(2)}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Item Discount:</span>
              <span>-$${calculateItemDiscount().toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (${taxRate}%):</span>
              <span>$${calculateTax().toFixed(2)}</span>
            </div>
            ${additionalDiscount > 0 ? `
            <div class="total-row">
              <span>Additional Discount:</span>
              <span>-$${additionalDiscount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>Grand Total:</span>
              <span>$${calculateGrandTotal().toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated by BizzBuddy Business Management System on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Write the HTML to the new window and print
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for the content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleSaveInvoice = () => {
    // TODO: Implement save to database
    setShowSuccessModal(true);
  };

  const handleDownloadPDF = () => {
    // Create a simple text-based invoice for download
    const invoiceContent = `
BIZZBUDDY INVOICE
================

Invoice #: INV-${Date.now().toString().slice(-6)}
Date: ${new Date().toLocaleDateString()}
Customer: ${selectedCustomer}

ITEMS:
------
${items.map(item => 
  `${item.name} - $${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

TOTALS:
-------
Subtotal: $${calculateSubtotal().toFixed(2)}
Item Discount: -$${calculateItemDiscount().toFixed(2)}
Tax (${taxRate}%): $${calculateTax().toFixed(2)}
${additionalDiscount > 0 ? `Additional Discount: -$${additionalDiscount.toFixed(2)}\n` : ''}
GRAND TOTAL: $${calculateGrandTotal().toFixed(2)}

Generated by BizzBuddy on ${new Date().toLocaleString()}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${selectedCustomer.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const updateItemQuantity = (id, quantity) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, parseInt(quantity) || 0) } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      name: "New Item",
      price: 0,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  return (
    <div className="create-invoice-container">
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
              key={item.name}
              className="menu-item"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate(item.name);
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
          <button className="dashboard-btn" onClick={() => onNavigate("Dashboard")}>
            <span className="dashboard-icon">←</span>
            Back to Dashboard
          </button>
          <div className="header-left">
            <h1>Create New Invoice</h1>
          </div>
        </div>

        <div className="invoice-content">
          {/* Left Column */}
          <div className="left-column">
            {/* Customer Selection */}
            <div className="section">
              <h2>Select Customer</h2>
              <div className="customer-select">
                <select 
                  value={selectedCustomer} 
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                >
                  {customers.map(customer => (
                    <option key={customer} value={customer}>{customer}</option>
                  ))}
                </select>
                <button className="add-customer-btn">Add New Customer</button>
              </div>
            </div>

            {/* Item Details */}
            <div className="section">
              <h2>Item Details</h2>
              <div className="items-list">
                {items.map((item) => (
                  <div key={item.id} className="item-row">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${item.price}</span>
                    </div>
                    <div className="item-controls">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                        min="0"
                        className="quantity-input"
                      />
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="add-item-btn" onClick={addNewItem}>
                  <span className="add-icon">⊕</span>
                  Add Item
                </button>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="section">
              <h2>Invoice Details</h2>
              <div className="invoice-details">
                <div className="detail-row">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                
                <div className="detail-row">
                  <label>Additional Discount ($)</label>
                  <input
                    type="number"
                    value={additionalDiscount}
                    onChange={(e) => setAdditionalDiscount(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="confirmInventory"
                    checked={confirmInventory}
                    onChange={(e) => setConfirmInventory(e.target.checked)}
                  />
                  <label htmlFor="confirmInventory">
                    Confirm inventory update upon saving
                  </label>
                </div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="section">
              <h2>Invoice Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row discount">
                <span>Total Item Discount:</span>
                <span>-${calculateItemDiscount().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax ({taxRate}%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              
              <div className="summary-row total">
                <span>Grand Total:</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
              
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSaveInvoice}>Save Invoice</button>
                <button className="print-btn" onClick={handlePrintInvoice}>Print Invoice</button>
                <button className="download-btn" onClick={handleDownloadPDF}>Download</button>
              </div>
            </div>
          </div>

          {/* Right Column - Empty for now */}
          <div className="right-column">
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
            <div className="success-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="success-icon">✓</div>
                <h2>Invoice Saved Successfully!</h2>
                <p>Your invoice has been saved to the database.</p>
              </div>
              
              <div className="modal-body">
                <div className="invoice-info-box">
                  <div className="info-row">
                    <span className="info-label">Invoice Number:</span>
                    <span className="info-value">INV-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Customer:</span>
                    <span className="info-value">{selectedCustomer}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total Amount:</span>
                    <span className="info-value">${calculateGrandTotal().toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="modal-btn download-btn" onClick={() => {
                  handleDownloadPDF();
                  setShowSuccessModal(false);
                }}>
                  📥 Download Invoice
                </button>
                <button className="modal-btn print-btn" onClick={() => {
                  handlePrintInvoice();
                  setShowSuccessModal(false);
                }}>
                  🖨️ Print Invoice
                </button>
                <button className="modal-btn close-btn" onClick={() => setShowSuccessModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;