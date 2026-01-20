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

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      company: 'Johnson\'s Bakery',
      quote: 'BizzBuddy transformed how I manage my bakery. The inventory tracking and sales analytics are game-changers!',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Retail Manager',
      company: 'Tech Solutions Inc.',
      quote: 'The AI assistant helps me make quick decisions. Customer management has never been this easy.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Restaurant Owner',
      company: 'Bella Vista Restaurant',
      quote: 'From inventory to sales tracking, BizzBuddy handles everything. Highly recommended!',
      avatar: '👩‍🍳'
    }
  ];

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
            <div className="hero-social-proof">
              <div className="social-proof-item">
                <div className="avatars">
                  <div className="avatar">👨‍💼</div>
                  <div className="avatar">👩‍💻</div>
                  <div className="avatar">👨‍🍳</div>
                  <div className="avatar">👩‍🔬</div>
                </div>
                <div className="social-proof-text">
                  <strong>2,500+</strong> business owners trust BizzBuddy
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <div className="mockup-title">BizzBuddy Dashboard</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-sidebar">
                  <div className="sidebar-item active">
                    <span className="sidebar-icon">📊</span>
                    Dashboard
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">💰</span>
                    Sales
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">📦</span>
                    Inventory
                  </div>
                  <div className="sidebar-item">
                    <span className="sidebar-icon">👥</span>
                    Customers
                  </div>
                </div>
                <div className="mockup-main">
                  <div className="stats-cards">
                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-title">Total Revenue</span>
                        <span className="stat-icon">💰</span>
                      </div>
                      <div className="stat-value">$124,500</div>
                      <div className="stat-change positive">+12.5%</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-header">
                        <span className="stat-title">Orders</span>
                        <span className="stat-icon">📋</span>
                      </div>
                      <div className="stat-value">1,247</div>
                      <div className="stat-change positive">+8.2%</div>
                    </div>
                  </div>
                  <div className="chart-area">
                    <div className="chart-header">Sales Overview</div>
                    <div className="chart">
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <div className="chart-bar" style={{height: '70%'}}></div>
                      <div className="chart-bar" style={{height: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$2M+</div>
              <div className="stat-label">Revenue Managed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">Loved by business owners worldwide</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                    <div className="author-company">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to transform your business?</h2>
            <p className="cta-subtitle">
              Join thousands of business owners who trust BizzBuddy to manage and grow their operations.
            </p>
            <div className="cta-actions">
              <button className="btn-primary large" onClick={onGetStarted}>
                Start Your Free Trial
                <span className="btn-icon">→</span>
              </button>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                14-day free trial
              </div>
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                No credit card required
              </div>
              <div className="cta-feature">
                <span className="check-icon">✓</span>
                Cancel anytime
              </div>
            </div>
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
                The smart business management platform for modern entrepreneurs.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#integrations">Integrations</a>
                <a href="#api">API</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#about">About Us</a>
                <a href="#careers">Careers</a>
                <a href="#blog">Blog</a>
                <a href="#press">Press</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#help">Help Center</a>
                <a href="#contact">Contact</a>
                <a href="#status">Status</a>
                <a href="#security">Security</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copyright">
              © 2025 BizzBuddy. All rights reserved.
            </div>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;