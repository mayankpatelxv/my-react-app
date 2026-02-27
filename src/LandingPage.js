import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Real-time business insights with interactive dashboards and comprehensive reporting tools.'
    },
    {
      icon: '💰',
      title: 'Financial Management',
      description: 'Complete sales, purchase, and invoice management with automated calculations.'
    },
    {
      icon: '📦',
      title: 'Inventory Control',
      description: 'Track stock levels, manage products, and optimize your inventory with smart alerts.'
    },
    {
      icon: '👥',
      title: 'Customer Relations',
      description: 'Manage customers and suppliers with detailed profiles and transaction history.'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get instant business insights and help with our intelligent AI chatbot.'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your business data anywhere with our responsive, mobile-first design.'
    }
  ];

  const handleFooterClick = (section) => {
    // Scroll to features section if it exists
    if (section === 'features') {
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // For other sections, you can add more logic or just prevent default
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo">
              <span className="logo-text">BB</span>
            </div>
            <span className="brand-name">BizzBuddy</span>
          </div>
          <div className="nav-right">
            <button className="nav-btn login" onClick={onGetStarted}>Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀 New: AI-Powered Business Insights</span>
            </div>
            <h1 className="hero-title">
              Manage Your Business
              <span className="gradient-text"> Smarter</span>
            </h1>
            <p className="hero-subtitle">
              BizzBuddy is the all-in-one business management platform that helps you streamline operations, 
              track finances, and grow your business with powerful AI-driven insights.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onGetStarted}>
                Start Free Trial
                <span className="btn-icon">→</span>
              </button>
            </div>
            <div className="hero-features-list">
              <div className="hero-feature-item">
                <span className="check-icon">✓</span>
                Easy to use
              </div>
              <div className="hero-feature-item">
                <span className="check-icon">✓</span>
                Secure & reliable
              </div>
              <div className="hero-feature-item">
                <span className="check-icon">✓</span>
                24/7 support
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-screenshot">
              <img 
                src={`${process.env.PUBLIC_URL}/dashboard-screenshot.png`} 
                alt="BizzBuddy Dashboard" 
                className="screenshot-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything you need to run your business</h2>
            <p className="section-subtitle">
              Powerful tools designed to streamline your operations and boost productivity
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <span className="logo-text">BB</span>
              </div>
              <span className="brand-name">BizzBuddy</span>
              <p className="footer-description">
                The smart business management platform for modern entrepreneurs. Streamline your operations, 
                track finances, and grow your business with powerful AI-driven insights.
              </p>
              <div className="footer-social">
                <a href="mailto:support@bizzbuddy.com" className="social-link" title="Email">📧</a>
                <a href="tel:+1234567890" className="social-link" title="Phone">📞</a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features" onClick={(e) => { e.preventDefault(); handleFooterClick('features'); }}>Features</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about" onClick={(e) => { e.preventDefault(); alert('About Us\n\nBizzBuddy is a comprehensive business management platform designed to help entrepreneurs and small business owners streamline their operations, manage finances, and grow their business efficiently.'); }}>About Us</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help" onClick={(e) => { e.preventDefault(); alert('Help Center\n\nFor assistance, please contact us at:\nEmail: support@bizzbuddy.com\nPhone: +1234567890\n\nOr use the Login button to access your dashboard.'); }}>Help Center</a>
                <a href="mailto:support@bizzbuddy.com">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2026 BizzBuddy. All rights reserved. Made with ❤️ for entrepreneurs.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;