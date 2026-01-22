import { useState } from "react";
import "./UserMenu.css";

const UserMenu = ({ user, onLogout, onNavigate }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="user-menu">
      <button 
        className="user-avatar" 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        👤
      </button>
      
      {/* User Dropdown Menu */}
      {isUserMenuOpen && (
        <>
          <div 
            className="user-menu-overlay" 
            onClick={() => setIsUserMenuOpen(false)}
          ></div>
          <div className="user-dropdown">
            <div className="user-dropdown-header">
              <div className="user-avatar-large">👤</div>
              <div className="user-info">
                <h3>{user?.name || "User"}</h3>
                <p>{user?.email || "user@example.com"}</p>
              </div>
            </div>
            <div className="user-dropdown-divider"></div>
            <div className="user-dropdown-body">
              <div className="user-detail-item">
                <span className="detail-icon">📧</span>
                <div className="detail-content">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user?.email || "Not provided"}</span>
                </div>
              </div>
              <div className="user-detail-item">
                <span className="detail-icon">👤</span>
                <div className="detail-content">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{user?.name || "Not provided"}</span>
                </div>
              </div>
              <div className="user-detail-item">
                <span className="detail-icon">🆔</span>
                <div className="detail-content">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{user?.id ? user.id.substring(0, 8) + "..." : "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="user-dropdown-divider"></div>
            <div className="user-dropdown-footer">
              <button 
                className="user-dropdown-btn settings-btn"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onNavigate("Settings");
                }}
              >
                <span>⚙️</span>
                Settings
              </button>
              <button 
                className="user-dropdown-btn logout-btn"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onLogout();
                }}
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
