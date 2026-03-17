import { createContext, useContext, useState, useCallback } from "react";
import "./ConfirmDialog.css";

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx.confirm;
};

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(({ title = "Are you sure?", message, confirmText = "Delete", cancelText = "Cancel", danger = true }) => {
    return new Promise((resolve) => {
      setDialog({ title, message, confirmText, cancelText, danger, resolve });
    });
  }, []);

  const handleConfirm = () => { dialog.resolve(true);  setDialog(null); };
  const handleCancel  = () => { dialog.resolve(false); setDialog(null); };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <div className="confirm-box" onClick={e => e.stopPropagation()}>
            <div className={`confirm-icon-wrap ${dialog.danger ? "danger" : "info"}`}>
              {dialog.danger ? "🗑️" : "❓"}
            </div>
            <h3 className="confirm-title">{dialog.title}</h3>
            {dialog.message && <p className="confirm-message">{dialog.message}</p>}
            <div className="confirm-actions">
              <button className="confirm-btn-cancel" onClick={handleCancel}>
                {dialog.cancelText}
              </button>
              <button className={`confirm-btn-ok ${dialog.danger ? "danger" : "primary"}`} onClick={handleConfirm}>
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
