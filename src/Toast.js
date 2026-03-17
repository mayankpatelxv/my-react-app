import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import "./Toast.css";

// ── Context ────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

// ── Provider ───────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  }, []);

  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type, leaving: false }]);
    setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const success = useCallback((msg, dur) => toast(msg, "success", dur), [toast]);
  const error   = useCallback((msg, dur) => toast(msg, "error",   dur ?? 5000), [toast]);
  const warning = useCallback((msg, dur) => toast(msg, "warning", dur), [toast]);
  const info    = useCallback((msg, dur) => toast(msg, "info",    dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, remove }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ── Single Toast ───────────────────────────────────────────────
const ICONS = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

const ToastItem = ({ toast, onRemove }) => (
  <div className={`toast toast-${toast.type} ${toast.leaving ? "toast-leave" : "toast-enter"}`}>
    <span className="toast-icon">{ICONS[toast.type]}</span>
    <span className="toast-message">{toast.message}</span>
    <button className="toast-close" onClick={() => onRemove(toast.id)}>×</button>
  </div>
);

export default ToastProvider;
