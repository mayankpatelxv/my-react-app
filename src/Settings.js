import { useState } from "react";
import "./Settings.css";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";

const Settings = ({ onBack, user, onLogout, onNavigate }) => {
  const { settings, updateSetting, getText } = useSettings();
  const [activeSection, setActiveSection] = useState('general');

  const settingSections = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'data', name: 'Data & Privacy', icon: '🔒' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ];

  const renderGeneralSettings = () => (
    <div className="settings-content">
      <h3>General Settings</h3>
      
      <div className="setting-group">
        <label className="setting-label">Language</label>
        <select 
          value={settings.language} 
          onChange={(e) => updateSetting('language', e.target.value)}
          className="setting-select"
        >
          <option value="english">English</option>
          <option value="spanish">Español</option>
          <option value="french">Français</option>
          <option value="german">Deutsch</option>
          <option value="hindi">हिंदी</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">Default Currency</label>
        <select 
          value={settings.currency} 
          onChange={(e) => updateSetting('currency', e.target.value)}
          className="setting-select"
        >
          <option value="EUR">EUR (€)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="INR">INR (₹)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">Date Format</label>
        <select 
          value={settings.dateFormat} 
          onChange={(e) => updateSetting('dateFormat', e.target.value)}
          className="setting-select"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div className="setting-group">
        <label className="setting-label">Time Format</label>
        <select 
          value={settings.timeFormat} 
          onChange={(e) => updateSetting('timeFormat', e.target.value)}
          className="setting-select"
        >
          <option value="24h">24 Hour</option>
          <option value="12h">12 Hour (AM/PM)</option>
        </select>
      </div>

      <div className="setting-group">
        <div className="setting-toggle">
          <label className="setting-label">Auto Save</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.autoSave}
              onChange={(e) => updateSetting('autoSave', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <p className="setting-description">Automatically save changes as you work</p>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-content">
      <h3>Appearance Settings</h3>
      
      <div className="setting-group">
        <label className="setting-label">Theme</label>
        <div className="theme-options">
          <div 
            className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
            onClick={() => updateSetting('theme', 'light')}
          >
            <div className="theme-preview light-preview">
              <div className="preview-header"></div>
              <div className="preview-content"></div>
            </div>
            <span>Light</span>
          </div>
          <div 
            className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
            onClick={() => updateSetting('theme', 'dark')}
          >
            <div className="theme-preview dark-preview">
              <div className="preview-header"></div>
              <div className="preview-content"></div>
            </div>
            <span>Dark</span>
          </div>
          <div 
            className={`theme-option ${settings.theme === 'auto' ? 'active' : ''}`}
            onClick={() => updateSetting('theme', 'auto')}
          >
            <div className="theme-preview auto-preview">
              <div className="preview-header"></div>
              <div className="preview-content"></div>
            </div>
            <span>Auto</span>
          </div>
        </div>
      </div>

      <div className="setting-group">
        <div className="setting-toggle">
          <label className="setting-label">Compact View</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.compactView}
              onChange={(e) => updateSetting('compactView', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <p className="setting-description">Use smaller spacing and compact layouts</p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-content">
      <h3>Notification Settings</h3>
      
      <div className="setting-group">
        <div className="setting-toggle">
          <label className="setting-label">Enable Notifications</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <p className="setting-description">Receive notifications for important updates</p>
      </div>

      <div className="notification-types">
        <h4>Notification Types</h4>
        <div className="notification-item">
          <span>📧 Email Notifications</span>
          <div className="toggle-switch small">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <div className="notification-item">
          <span>💰 Payment Reminders</span>
          <div className="toggle-switch small">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </div>
        </div>
        <div className="notification-item">
          <span>📊 Report Updates</span>
          <div className="toggle-switch small">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="settings-content">
      <h3>Data & Privacy</h3>
      
      <div className="data-actions">
        <div className="data-action-item">
          <div className="action-info">
            <h4>Export Data</h4>
            <p>Download all your business data</p>
          </div>
          <button className="action-btn primary">Export</button>
        </div>
        
        <div className="data-action-item">
          <div className="action-info">
            <h4>Import Data</h4>
            <p>Import data from other systems</p>
          </div>
          <button className="action-btn secondary">Import</button>
        </div>
        
        <div className="data-action-item">
          <div className="action-info">
            <h4>Clear Cache</h4>
            <p>Clear temporary files and cache</p>
          </div>
          <button className="action-btn secondary">Clear</button>
        </div>
        
        <div className="data-action-item danger">
          <div className="action-info">
            <h4>Delete All Data</h4>
            <p>Permanently delete all your data</p>
          </div>
          <button className="action-btn danger">Delete</button>
        </div>
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="settings-content">
      <h3>About bizBuddy</h3>
      
      <div className="about-info">
        <div className="app-logo">
          <BizBuddyLogo size={60} />
        </div>
        <h2>bizBuddy</h2>
        <p className="version">Version 1.0.0</p>
        <p className="description">
          Your smart business support system for managing sales, purchases, 
          inventory, and generating comprehensive business reports.
        </p>
        
        <div className="about-links">
          <a href="#" className="about-link">📄 Terms of Service</a>
          <a href="#" className="about-link">🔒 Privacy Policy</a>
          <a href="#" className="about-link">❓ Help & Support</a>
          <a href="#" className="about-link">🐛 Report a Bug</a>
        </div>
        
        <div className="copyright">
          <p>© 2024 bizBuddy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'notifications': return renderNotificationSettings();
      case 'data': return renderDataSettings();
      case 'about': return renderAboutSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {settingSections.map((section) => (
            <div
              key={section.id}
              className={`settings-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              <span className="nav-text">{section.name}</span>
            </div>
          ))}
        </div>

        <div className="settings-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;