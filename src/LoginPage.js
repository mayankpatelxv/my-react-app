import { useState } from "react";
import "./LoginPage.css";
import { loginUser, signInWithGoogle } from "./supabaseClient";
import BizBuddyLogo from "./BizBuddyLogo";

const LoginPage = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrors({ submit: "Please fill in all fields" });
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        onLoginSuccess(result.data);
      } else {
        setErrors({ submit: "Invalid email or password. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "Login failed: " + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrors({ submit: "Google login failed: " + result.error });
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ submit: "Google login failed: " + error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Gradient with Features */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="brand-section">
            <BizBuddyLogo size={48} />
            <h1 className="brand-name">bizBuddy</h1>
          </div>

          <div className="hero-section">
            <h2>Grow Your Business with Smart Solutions</h2>
            <p>Join thousands of businesses already using bizBuddy to streamline operations, manage teams, and accelerate growth.</p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <div className="feature-content">
                <h4>Boost Productivity</h4>
                <p>Automate workflows and save hours every week</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div className="feature-content">
                <h4>Team Collaboration</h4>
                <p>Work together seamlessly with powerful tools</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-content">
                <h4>Real-time Analytics</h4>
                <p>Make data-driven decisions with actionable insights</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-content">
                <h4>Goal Tracking</h4>
                <p>Set and achieve your business objectives faster</p>
              </div>
            </div>
          </div>

          <div className="auth-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>

          <div className="copyright">
            © 2025 bizBuddy. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button className="auth-tab active">Sign In</button>
            <button className="auth-tab" onClick={onSwitchToRegister}>Sign Up</button>
          </div>

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {errors.submit && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <span>Or sign in with</span>
          </div>

          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
