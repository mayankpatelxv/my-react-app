import { useState } from "react";
import "./Settings.css";
import { useSettings } from "./SettingsContext";
import BizBuddyLogo from "./BizBuddyLogo";
import { getItems, getParties, getSales, getPurchases, deleteAllUserData } from "./supabaseClient";
import { useToast } from "./Toast";

const Settings = ({ onBack, user, onLogout, onNavigate }) => {
  const { settings, updateSetting, getText } = useSettings();
  const [activeSection, setActiveSection] = useState('general');
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const settingSections = [
    { id: 'general', name: 'General', icon: '⚙️' },
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
    </div>
  );

  // Data & Privacy handlers
  const handleExportData = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all data
      const [itemsRes, partiesRes, salesRes, purchasesRes] = await Promise.all([
        getItems(user.id),
        getParties(user.id),
        getSales(user.id),
        getPurchases(user.id)
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email,
        items: itemsRes.success ? itemsRes.data : [],
        parties: partiesRes.success ? partiesRes.data : [],
        sales: salesRes.success ? salesRes.data : [],
        purchases: purchasesRes.success ? purchasesRes.data : []
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bizbuddy-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAllData = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete ALL your data including items, parties, sales, and purchases. This action CANNOT be undone!\n\nType 'DELETE' in the next prompt to confirm."
    );

    if (!confirmed) return;

    const confirmText = window.prompt("Type 'DELETE' to confirm:");
    if (confirmText !== 'DELETE') {
      toast.info("Deletion cancelled");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAllUserData(user.id);
      
      if (result.success) {
        toast.success("All data deleted successfully");
        // Optionally redirect to dashboard
        setTimeout(() => {
          onNavigate("Dashboard");
        }, 2000);
      } else {
        toast.error("Failed to delete data: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete data");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderDataSettings = () => (
    <div className="settings-content">
      <h3>Data & Privacy</h3>
      
      <div className="data-actions">
        <div className="data-action-item">
          <div className="action-info">
            <h4>Export Data</h4>
            <p>Download all your business data as JSON</p>
          </div>
          <button 
            className="action-btn primary" 
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
        
        <div className="data-action-item danger">
          <div className="action-info">
            <h4>Delete All Data</h4>
            <p>Permanently delete all your business data</p>
          </div>
          <button 
            className="action-btn danger"
            onClick={handleDeleteAllData}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
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
        
        <div className="about-section">
          <h3>📌 About Us</h3>
          <p className="about-description">
            We are a team of passionate developers from <strong>GLS University, Faculty of Computer Applications & Information Technology</strong>, 
            pursuing <strong>Integrated MSc (IT)</strong>. Our project, <strong>"Smart Customer Support System for Small Businesses,"</strong> is designed 
            to simplify and automate daily business operations using modern web technologies.
          </p>
          <p className="about-description">
            This platform is built with <strong>React JS</strong> for the front-end and <strong>Supabase</strong> (PostgreSQL, Authentication, and Storage) 
            for the back-end, ensuring a secure, scalable, and efficient system.
          </p>
          <p className="about-description">
            Our goal is to help small and medium-sized businesses manage their operations more effectively by providing a centralized solution 
            that includes user management, sales tracking, purchase handling, expense monitoring, and report generation.
          </p>
          <p className="about-description">
            The system also integrates an <strong>intelligent AI Chatbot</strong> that provides real-time assistance, helping users navigate 
            the platform and resolve business-related queries instantly.
          </p>
          <p className="about-description">
            We believe in reducing manual work, minimizing errors, and enhancing productivity through automation and smart technology. 
            Our solution also ensures secure document storage and provides insightful analytics through dashboards and reports, 
            empowering businesses to make better decisions.
          </p>
        </div>

        <div className="team-section">
          <h3>👨‍💻 Our Team</h3>
          <div className="team-members">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <div className="member-name">Patel Mayank R</div>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <div className="member-name">Patel Parv S</div>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <div className="member-name">Patel Ark N</div>
            </div>
          </div>
        </div>

        <div className="mission-section">
          <h3>🎯 Our Mission</h3>
          <p className="mission-text">
            To create a smart, user-friendly, and efficient digital platform that empowers businesses to manage their operations 
            seamlessly while leveraging automation and AI for better productivity and growth.
          </p>
        </div>
        
        <div className="copyright">
          <p className="university">GLS University - Faculty of Computer Applications & IT</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
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
        <button className="logout-btn" onClick={onLogout}>
          <span className="logout-icon">🚪</span>
          Logout
        </button>
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