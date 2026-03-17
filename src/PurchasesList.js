import { useState, useEffect } from "react";
import "./PurchasesList.css";
import { getPurchasesWithDocuments } from "./supabaseClient";
import LoadingSkeleton from "./LoadingSkeleton";
import { useToast } from "./Toast";

const PurchasesList = ({ user, onBack }) => {
  const toast = useToast();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError("");
    
    try {
      const result = await getPurchasesWithDocuments(user.id);
      if (result.success) {
        setPurchases(result.data || []);
      } else {
        setError(result.error || "Failed to fetch purchases");
      }
    } catch (err) {
      setError("Failed to fetch purchases");
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (documentUrl, fileName) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      toast.info(`Document: ${fileName || 'Unknown file'}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="purchases-list-container">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Purchase History</h1>
      </div>

      {loading && (
        <div className="loading-skeleton-container">
          <LoadingSkeleton type="table" rows={8} columns={6} />
        </div>
      )}

      {error && (
        <div className="error-state">
          <div className="error-icon">❌</div>
          <p>{error}</p>
          <button onClick={fetchPurchases} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="purchases-table-container">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="bill-number">{purchase.bill_number}</td>
                  <td className="supplier-name">{purchase.supplier_name}</td>
                  <td className="purchase-date">{formatDate(purchase.purchase_date)}</td>
                  <td className="total-amount">{formatCurrency(purchase.total_amount)}</td>
                  <td className="status">
                    <span className={`status-badge ${purchase.status}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="document-cell">
                    {purchase.attached_document ? (
                      <button 
                        className="view-document-btn"
                        onClick={() => handleViewDocument(purchase.document_url, purchase.attached_document)}
                      >
                        📄 View
                      </button>
                    ) : (
                      <span className="no-document">No document</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {purchases.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Purchases Found</h3>
              <p>You haven't created any purchases yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchasesList;