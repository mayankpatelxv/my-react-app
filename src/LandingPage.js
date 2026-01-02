import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: '📊',
      title: 'Smart Dashboard',
      description: 'Get real-time insights into your business performance with interactive charts and analytics.'
    },
    {
      icon: '👥',
      title: 'Party Management',
      description: 'Efficiently manage customers and suppliers with detailed profiles and transaction history.'
    },
    {
      icon: '📦',
      title: 'Inventory Control',
      description: 'Track your products, manage stock levels, and optimize your inventory management.'
    },
    {
      icon: '💰',
      title: 'Sales & Purchases',
      description: 'Streamline your sales process and purchase management with automated workflows.'
    },
    {
      icon: '📈',
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with comprehensive reports and business intelligence.'
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Get instant help and insights with our built-in AI chatbot for business queries.'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with modern React technology for blazing fast performance and smooth user experience.'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your business data is protected with enterprise-grade security and reliable cloud infrastructure.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Access your business data anywhere, anytime with our fully responsive design.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="logo-icon">
              <span>&lt;/&gt;</span>
            </div>
            <span className="brand-name">bizBuddy</span>
          </div>
          <div className="nav-actions">
            <button className="nav-btn login-btn" onClick={onGetStarted}>
              Login
            </button>
            <button className="nav-btn signup-btn" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              bizBuddy is the <span className="highlight">Smart Business</span> Management Solution!
            </h1>
            <p className="hero-description">
              bizBuddy is a comprehensive business management software that helps you streamline operations, 
              manage finances, track inventory, and grow your business with powerful analytics and AI assistance.
            </p>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={onGetStarted}>
                Start Free Trial
              </button>
              <button className="cta-button secondary">
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Business owners trust bizBuddy</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries worldwide</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="preview-content">
                <div className="preview-sidebar">
                  <div className="sidebar-item active">📊 Dashboard</div>
                  <div className="sidebar-item">👥 Parties</div>
                  <div className="sidebar-item">📦 Items</div>
                  <div className="sidebar-item">💰 Sales</div>
                  <div className="sidebar-item">📈 Reports</div>
                </div>
                <div className="preview-main">
                  <div className="preview-cards">
                    <div className="preview-card">
                      <div className="card-header">Total Sales</div>
                      <div className="card-value">$45,231</div>
                      <div className="card-trend positive">+20.1%</div>
                    </div>
                    <div className="preview-card">
                      <div className="card-header">Net Profit</div>
                      <div className="card-value">$30,131</div>
                      <div className="card-trend positive">+18.8%</div>
                    </div>
                  </div>
                  <div className="preview-chart">
                    <div className="chart-bars">
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why bizBuddy is the Perfect Business Management Solution</h2>
            <p>Discover powerful features designed to streamline your business operations and boost productivity.</p>
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

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>3 Reasons Why bizBuddy is Your Best Business Partner</h2>
            <p>Built with cutting-edge technology and designed for modern businesses.</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How bizBuddy Makes Business Management Simple</h2>
            <p>Get started in minutes with our intuitive interface and powerful automation.</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Sign Up & Setup</h3>
                <p>Create your account and set up your business profile in under 5 minutes.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Import Your Data</h3>
                <p>Easily import your existing customers, products, and financial data.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Managing</h3>
                <p>Begin managing your business with powerful tools and real-time insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>Join thousands of business owners who trust bizBuddy to manage and grow their operations.</p>
            <button className="cta-button large" onClick={onGetStarted}>
              Get Started Free
            </button>
            <p className="cta-note">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-icon">
                <span>&lt;/&gt;</span>
              </div>
              <span className="brand-name">bizBuddy</span>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#demo">Demo</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#docs">Documentation</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About</a>
                <a href="#blog">Blog</a>
                <a href="#careers">Careers</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 bizBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;