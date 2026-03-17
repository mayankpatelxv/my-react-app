import { useState, useEffect } from "react";
import "./InstallPrompt.css";

const InstallPrompt = () => {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-icon">
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="14" fill="url(#ig)"/>
          <defs>
            <linearGradient id="ig" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#667eea"/>
              <stop offset="100%" stopColor="#764ba2"/>
            </linearGradient>
          </defs>
          <text x="32" y="44" fontFamily="Arial" fontSize="36" fontWeight="bold"
                textAnchor="middle" fill="white">B</text>
        </svg>
      </div>
      <div className="install-banner-text">
        <span className="install-banner-title">Install BizBuddy</span>
        <span className="install-banner-sub">Add to home screen for quick access</span>
      </div>
      <div className="install-banner-actions">
        <button className="install-btn-install" onClick={handleInstall}>Install</button>
        <button className="install-btn-dismiss" onClick={handleDismiss}>✕</button>
      </div>
    </div>
  );
};

export default InstallPrompt;
