import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const Particles = () => (
  <div className="particles-container" aria-hidden="true">
    {[...Array(16)].map((_, i) => (
      <div key={i} className={`particle particle-${i % 6}`} style={{
        left: `${(i * 17 + 5) % 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${4 + (i % 4)}s`
      }} />
    ))}
  </div>
);

const FloatingCard = ({ icon, label, value, color, delay, className }) => (
  <div className={`floating-card ${className || ''}`} style={{ animationDelay: delay }}>
    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    <div>
      <div className="floating-card-value" style={{ color }}>{value}</div>
      <div className="floating-card-label">{label}</div>
    </div>
  </div>
);

const BASE = process.env.PUBLIC_URL || '';

const previewTabs = [
  { label: '📊 Dashboard',    img: `${BASE}/dash.png`,    alt: 'Dashboard' },
  { label: '🤖 AI Assistant', img: `${BASE}/ai.png`,      alt: 'AI Assistant' },
  { label: '📈 Reports',      img: `${BASE}/report.png`,  alt: 'Annual Reports' },
  { label: '💰 Invoice',      img: `${BASE}/invoice.png`, alt: 'Create Invoice' },
];

const LandingPage = ({ onGetStarted }) => {
  const [previewTab, setPreviewTab] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [featuresRef, featuresInView] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: '📊', title: 'Smart Dashboard',    desc: 'Real-time overview of sales, purchases, profit and inventory at a glance.', color: '#6366f1', bg: '#ede9fe' },
    { icon: '💰', title: 'Sales & Invoicing',  desc: 'Create professional invoices, track payments and manage your sales pipeline.', color: '#f59e0b', bg: '#fef3c7' },
    { icon: '📦', title: 'Inventory Control',  desc: 'Track stock levels in real-time with low-stock alerts and category management.', color: '#10b981', bg: '#dcfce7' },
    { icon: '👥', title: 'Party Management',   desc: 'Unified customer & supplier database with full transaction history.', color: '#3b82f6', bg: '#dbeafe' },
    { icon: '🤖', title: 'AI Assistant',       desc: 'Ask business questions in plain English and get instant Gemini-powered insights.', color: '#8b5cf6', bg: '#ede9fe' },
    { icon: '📈', title: 'Annual Reports',     desc: 'Detailed financial reports with charts, export to PDF and trend analysis.', color: '#ec4899', bg: '#fce7f3' },
  ];

  return (
    <div className="landing-page">

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${navScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-logo"><span className="logo-text">BB</span></div>
            <span className="brand-name">BizzBuddy</span>
          </div>
          <div className="nav-links-center">
            <a href="#features" className="nav-link">Features</a>
            <a href="#preview"  className="nav-link">Preview</a>
          </div>
          <button className="nav-btn login" onClick={onGetStarted}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <Particles />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />

        <div className="hero-container">
          {/* Left copy */}
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <span className="badge-dot" />
              AI-Powered Business Management
            </div>
            <h1 className="hero-title animate-slide-up">
              Run Your Business<br />
              <span className="gradient-text">Smarter &amp; Faster</span>
            </h1>
            <p className="hero-subtitle animate-slide-up-delay">
              BizzBuddy is the all-in-one platform for sales, purchases,
              inventory and AI insights — built for modern entrepreneurs.
            </p>
            <div className="hero-actions animate-slide-up-delay2">
              <button className="btn-primary btn-glow" onClick={onGetStarted}>
                Start Free Today <span className="btn-icon">→</span>
              </button>
              <button className="btn-outline" onClick={() =>
                document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}>
                ▶ See Preview
              </button>
            </div>
            <div className="hero-trust animate-fade-in-delay">
              <span className="trust-item"><span className="check-icon">✓</span> No credit card</span>
              <span className="trust-item"><span className="check-icon">✓</span> Setup in 5 min</span>
              <span className="trust-item"><span className="check-icon">✓</span> 100% secure</span>
            </div>
          </div>

          {/* Right — real screenshot */}
          <div className="hero-visual animate-float">
            <div className="hero-preview-wrapper">
              <div className="preview-window-mini">
                <div className="preview-chrome-mini">
                  <span className="dot dot-red"/><span className="dot dot-yellow"/><span className="dot dot-green"/>
                  <span className="chrome-url-mini">bizbuddy.app/dashboard</span>
                </div>
                <img
                  src={`${BASE}/dash.png`}
                  alt="BizBuddy Dashboard"
                  className="hero-screenshot"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <FloatingCard icon="💰" label="Today's Sales"  value="₹1,947"  color="#10b981" delay="0s"   className="fc-top-right" />
              <FloatingCard icon="📦" label="Total Items"    value="1 Item"   color="#f59e0b" delay="0.6s" className="fc-bottom-right" />
              <FloatingCard icon="🤖" label="AI Insight"     value="Profit ↑77%" color="#6366f1" delay="1.2s" className="fc-bottom-left" />
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">✨ Features</div>
            <h2 className="section-title">Everything your business needs</h2>
            <p className="section-subtitle">Powerful tools to streamline operations and boost productivity</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card ${featuresInView ? 'card-visible' : ''}`}
                style={{ '--card-color': f.color, '--card-bg': f.bg, transitionDelay: `${i * 0.08}s` }}
              >
                <div className="feature-icon-wrap" style={{ background: f.bg }}>
                  <span className="feature-icon">{f.icon}</span>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-description">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW ── */}
      <section className="preview-section" id="preview">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">🖥️ Live Preview</div>
            <h2 className="section-title">See BizBuddy in action</h2>
            <p className="section-subtitle">Explore the actual screens you'll use every day</p>
          </div>

          <div className="preview-tabs">
            {previewTabs.map((tab, i) => (
              <button
                key={i}
                className={`preview-tab ${previewTab === i ? 'active' : ''}`}
                onClick={() => setPreviewTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="preview-window">
            <div className="preview-chrome">
              <div className="chrome-dots">
                <span className="dot dot-red"/><span className="dot dot-yellow"/><span className="dot dot-green"/>
              </div>
              <div className="chrome-url">bizbuddy.app · {previewTabs[previewTab].alt}</div>
            </div>
            <div className="preview-img-wrap">
              <img
                key={previewTab}
                src={previewTabs[previewTab].img}
                alt={previewTabs[previewTab].alt}
                className="preview-screenshot animate-fade-in"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                }}
              />
              {/* fallback if image missing */}
              <div className="preview-fallback" style={{ display: 'none' }}>
                <span style={{ fontSize: '3rem' }}>{previewTabs[previewTab].label.split(' ')[0]}</span>
                <p>Screenshot: {previewTabs[previewTab].alt}</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                  Add <code>public/{previewTabs[previewTab].img.split('/').pop()}</code> to show this screen
                </p>
              </div>
            </div>
          </div>

          <div className="preview-cta">
            <button className="btn-primary btn-glow" onClick={onGetStarted}>
              Try It Free — Start Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-glow" />
        <div className="container">
          <h2 className="cta-title">Ready to grow your business?</h2>
          <p className="cta-subtitle">Join entrepreneurs already using BizBuddy to manage smarter</p>
          <button className="btn-primary btn-large btn-glow" onClick={onGetStarted}>
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo-row">
                <div className="brand-logo"><span className="logo-text">BB</span></div>
                <span className="brand-name footer-brand-name">BizzBuddy</span>
              </div>
              <p className="footer-description">
                The smart business management platform for modern entrepreneurs.
              </p>
              <div className="footer-social">
                <a href="mailto:support@bizzbuddy.com" className="social-link" title="Email">📧</a>
                <a href="tel:+1234567890"              className="social-link" title="Phone">📞</a>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#features" onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</a>
                <a href="#preview"  onClick={e => { e.preventDefault(); document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' }); }}>Preview</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="mailto:support@bizzbuddy.com">Contact Us</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2026 BizzBuddy. All rights reserved. Made with ❤️ for entrepreneurs.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
