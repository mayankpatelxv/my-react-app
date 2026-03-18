import { useState, useEffect } from "react";
import "./Purchases.css";
import { getItems, getParties, createPurchaseWithItems, uploadPurchaseDocument, updateItem } from "./supabaseClient";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import PurchasesList from "./PurchasesList";
import LoadingSkeleton from "./LoadingSkeleton";
import { useToast } from "./Toast";

const Purchases = ({ user, onLogout, onNavigate }) => {
  const { formatCurrency, getText, formatDate } = useSettings();
  const toast = useToast();
  const [activeMenu, setActiveMenu] = useState("Purchases");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [billNumber, setBillNumber] = useState("");
  const [attachedDocument, setAttachedDocument] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPurchasesList, setShowPurchasesList] = useState(false);
  
  // Data from database
  const [availableItems, setAvailableItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [items, setItems] = useState([]);

  const menuItems = [
    { name: getText('dashboard'), icon: "📊", key: "Dashboard" },
    { name: getText('parties'), icon: "👥", key: "Party Management" },
    { name: getText('items'), icon: "📦", key: "Item Management" },
    { name: getText('sales'), icon: "🛒", key: "Sales" },
    { name: getText('purchases'), icon: "💰", key: "Purchases" },
    { name: getText('reports'), icon: "📈", key: "Annual Reports" }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoadingData(true);
    try {
      // Fetch items and parties in parallel
      const [itemsResult, partiesResult] = await Promise.all([
        getItems(user.id),
        getParties(user.id)
      ]);

      if (itemsResult.success) {
        setAvailableItems(itemsResult.data);
      } else {
        console.error("Failed to fetch items:", itemsResult.error);
      }

      if (partiesResult.success) {
        console.log("All parties fetched:", partiesResult.data);
        
        // Filter for suppliers only (matching the actual party_type values from AddParty)
        const supplierList = partiesResult.data.filter(party => 
          party.party_type === 'Supplier' || party.party_type === 'Both'
        );
        
        console.log("Filtered supplier list:", supplierList);
        setSuppliers(supplierList);
        
        // Set first supplier as default if available
        if (supplierList.length > 0) {
          setSelectedSupplier(supplierList[0].name);
          setSelectedSupplierId(supplierList[0].id);
        }
      } else {
        console.error("Failed to fetch parties:", partiesResult.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // If showing purchases list, render that component
  if (showPurchasesList) {
    return <PurchasesList user={user} onBack={() => setShowPurchasesList(false)} />;
  }

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const quantity = Math.max(0, parseInt(newQuantity) || 0);
        return {
          ...item,
          quantity,
          total: quantity * item.unitCost
        };
      }
      return item;
    }));
  };

  const handleUnitCostChange = (itemId, newUnitCost) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const unitCost = Math.max(0, parseFloat(newUnitCost) || 0);
        return {
          ...item,
          unitCost,
          total: item.quantity * unitCost
        };
      }
      return item;
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleSupplierChange = (supplierName) => {
    setSelectedSupplier(supplierName);
    const supplier = suppliers.find(s => s.name === supplierName);
    setSelectedSupplierId(supplier ? supplier.id : null);
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    if (availableItems.length === 0) {
      toast.warning("No items available. Please add items in Item Management first.");
      return;
    }
    
    // Add first available item that's not already in the list
    const availableItem = availableItems.find(item => 
      !items.some(selectedItem => selectedItem.itemId === item.id)
    );
    
    if (!availableItem) {
      toast.info("All available items have been added to the purchase.");
      return;
    }
    
    const newItem = {
      id: Date.now(), // Temporary ID for the UI
      itemId: availableItem.id, // Reference to the actual item
      name: availableItem.name,
      unitCost: availableItem.price || 0,
      quantity: 1,
      total: availableItem.price || 0,
      description: availableItem.description
    };
    setItems([...items, newItem]);
  };

  const handleSavePurchase = async () => {
    if (!selectedSupplier) {
      toast.warning("Please select a supplier.");
      return;
    }
    
    if (items.length === 0) {
      toast.warning("Please add at least one item to the purchase.");
      return;
    }
    
    if (items.some(item => item.quantity <= 0)) {
      toast.warning("All items must have a quantity greater than 0.");
      return;
    }

    setIsSaving(true);
    
    try {
      let documentPath = null;
      
      // First, upload the file if there is one
      if (uploadedFile) {
        console.log("Starting file upload...");
        setIsUploading(true);
        const uploadResult = await uploadPurchaseDocument(uploadedFile, user.id, null);
        setIsUploading(false);
        
        console.log("Upload result:", uploadResult);
        
        if (uploadResult.success) {
          documentPath = uploadResult.data.path;
          console.log("File uploaded successfully, path:", documentPath);
        } else {
          console.error("Upload failed:", uploadResult.error);
          toast.error("Failed to upload document: " + uploadResult.error);
          setIsSaving(false);
          return;
        }
      }

      console.log("Creating purchase with document path:", documentPath);

      const purchaseData = {
        supplierName: selectedSupplier,
        supplierId: selectedSupplierId,
        billNumber: billNumber || null, // Will be auto-generated if empty
        purchaseDate: purchaseDate,
        subtotal: calculateGrandTotal(),
        taxRate: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: calculateGrandTotal(),
        status: 'pending',
        paymentTerms: null,
        notes: null,
        attachedDocument: documentPath || attachedDocument || null // Use uploaded file path or text
      };

      const result = await createPurchaseWithItems(purchaseData, items, user.id);
      
      if (result.success) {
        const billNum = result.data.purchase.bill_number;
        toast.success(`Purchase saved! Bill #${billNum}`);

        // Increase stock for each purchased item
        for (const purchasedItem of items) {
          if (!purchasedItem.itemId) continue;
          const sourceItem = availableItems.find(ai => ai.id === purchasedItem.itemId);
          if (!sourceItem) continue;
          const newStock = (sourceItem.stock_level || 0) + purchasedItem.quantity;
          await updateItem(purchasedItem.itemId, {
            name: sourceItem.name,
            category: sourceItem.category,
            unit: sourceItem.unit,
            price: sourceItem.price,
            stockLevel: newStock,
            minStockLevel: sourceItem.min_stock_level,
            description: sourceItem.description,
            sku: sourceItem.sku,
            barcode: sourceItem.barcode,
            supplier: sourceItem.supplier,
            location: sourceItem.location,
            weight: sourceItem.weight,
            dimensions: sourceItem.dimensions,
            notes: sourceItem.notes,
          }, user.id);
        }
        // Refresh available items so stock shows updated values
        const refreshed = await getItems(user.id);
        if (refreshed.success) setAvailableItems(refreshed.data);
        
        // Show browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Purchase Created", {
            body: `Bill #${billNum} for ${selectedSupplier} - ${formatCurrency(calculateGrandTotal())}`,
            icon: "/logo192.png"
          });
        }
        
        // Reset form
        setItems([]);
        setBillNumber("");
        setAttachedDocument("");
        setUploadedFile(null);
        
        // Optionally navigate to a purchases list or dashboard
        // onNavigate("Dashboard");
      } else {
        toast.error("Failed to save purchase: " + result.error);
      }
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error("Failed to save purchase. Please try again.");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.warning("Please upload only PDF, JPEG, PNG, GIF, or WebP files.");
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.warning("File size must be less than 10MB.");
        return;
      }
      
      setUploadedFile(file);
      setAttachedDocument(file.name);
      console.log("File selected for upload:", file.name);
    }
  };

  return (
    <div className="purchases-container">
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
                if (item.key !== "Purchases") {
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
            <h1>Purchases - Create Entry</h1>
          </div>
          <div className="header-actions">
            <button 
              className="view-history-btn"
              onClick={() => setShowPurchasesList(true)}
            >
              📋 View Purchase History
            </button>
          </div>
        </div>

        {/* Purchase Content */}
        <div className="purchase-content">
          {loadingData ? (
            <div className="loading-skeleton-container">
              <LoadingSkeleton type="form" />
            </div>
          ) : (
            <>
              {/* Purchase Details */}
              <div className="section purchase-details-section">
                <h2>Purchase Details</h2>
                <div className="purchase-details-grid">
                  <div className="form-group">
                    <label htmlFor="supplier">Supplier</label>
                    <select
                      id="supplier"
                      value={selectedSupplier}
                      onChange={(e) => handleSupplierChange(e.target.value)}
                      className="supplier-select"
                      disabled={suppliers.length === 0}
                    >
                      <option value="">Select a supplier...</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.name}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    {suppliers.length === 0 && (
                      <p className="no-data-message">
                        No suppliers found. Please add suppliers in Party Management first.
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchaseDate">Purchase Date</label>
                    <input
                      type="date"
                      id="purchaseDate"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="date-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="billNumber">Bill / Invoice No.</label>
                    <input
                      type="text"
                      id="billNumber"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="invoice-input"
                      placeholder="Leave empty for auto-generation"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="attachDocument">Attach Document</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id="attachDocument"
                        onChange={handleFileUpload}
                        className="file-input"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                        disabled={isUploading}
                      />
                      <label htmlFor="attachDocument" className={`file-upload-btn ${isUploading ? 'uploading' : ''}`}>
                        {isUploading ? '⏳ Uploading...' : '📎 Choose File'}
                      </label>
                      {attachedDocument && (
                        <div className="file-info">
                          <span className="file-name">{attachedDocument}</span>
                          {uploadedFile && (
                            <span className="file-size">
                              ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          )}
                        </div>
                      )}
                      <div className="file-help">
                        Supported: PDF, JPEG, PNG, GIF, WebP (Max 10MB)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchased Items */}
              <div className="section purchased-items-section">
                <div className="section-header">
                  <h2>Purchased Items</h2>
                  <button 
                    className="add-item-btn" 
                    onClick={handleAddItem}
                    disabled={availableItems.length === 0}
                  >
                    <span className="add-icon">➕</span>
                    Add Item
                  </button>
                </div>

                <div className="items-table-container">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Cost</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="item-name-cell">
                            <select
                              value={item.itemId || ''}
                              onChange={(e) => {
                                const selectedItem = availableItems.find(ai => ai.id === parseInt(e.target.value));
                                if (selectedItem) {
                                  setItems(prev => prev.map(it =>
                                    it.id === item.id
                                      ? {
                                          ...it,
                                          itemId: selectedItem.id,
                                          name: selectedItem.name,
                                          unitCost: selectedItem.price || 0,
                                          description: selectedItem.description || '',
                                          total: (selectedItem.price || 0) * it.quantity
                                        }
                                      : it
                                  ));
                                }
                              }}
                              className="item-select"
                            >
                              <option value="">Select item...</option>
                              {availableItems.map(availableItem => (
                                <option key={availableItem.id} value={availableItem.id}>
                                  {availableItem.name} - ${availableItem.price || 0}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="quantity-cell">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              min="0"
                              className="quantity-input"
                            />
                          </td>
                          <td className="unit-cost-cell">
                            <input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => handleUnitCostChange(item.id, e.target.value)}
                              min="0"
                              step="0.01"
                              className="unit-cost-input"
                            />
                          </td>
                          <td className="total-cell">
                            <span className="total-amount">{formatCurrency(item.total)}</span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="remove-btn"
                              onClick={() => handleRemoveItem(item.id)}
                              title="Remove Item"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {availableItems.length === 0 && (
                    <p className="no-data-message">
                      No items available. Please add items in Item Management first.
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="section summary-section">
                <h2>Summary</h2>
                <div className="summary-content">
                  <div className="summary-row">
                    <span className="summary-label">Total Items:</span>
                    <span className="summary-value">{items.length}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Total Quantity:</span>
                    <span className="summary-value">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="summary-row total-row">
                    <span className="summary-label">Grand Total:</span>
                    <span className="summary-value">{formatCurrency(calculateGrandTotal())}</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="save-btn" 
                    onClick={handleSavePurchase}
                    disabled={isSaving || isUploading || items.length === 0 || !selectedSupplier}
                  >
                    {isSaving ? (
                      <>
                        <span className="loading-spinner">⏳</span>
                        {isUploading ? 'Uploading & Saving...' : 'Saving...'}
                      </>
                    ) : (
                      "Save Purchase Entry"
                    )}
                  </button>
                  <button className="cancel-btn" onClick={() => onNavigate("Dashboard")}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;