import { useState } from "react";
import "./RegisterPage.css";
import { addUser, signInWithGoogle } from "./supabaseClient";
import BizBuddyLogo from "./BizBuddyLogo";
import { useToast } from "./Toast";

const RegisterPage = ({ onSwitchToLogin }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setErrors({ submit: "Please fill in all fields" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ submit: "Passwords do not match" });
      return;
    }

    if (!agreeToTerms) {
      setErrors({ submit: "Please agree to the Terms of Service and Privacy Policy" });
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const result = await addUser(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`
      );

      if (result.success) {
        toast.success("Registration successful! Please log in.");
        onSwitchToLogin();
      } else {
        setErrors({ submit: result.error || "Registration failed" });
      }
    } catch (error) {
      setErrors({ submit: "Registration failed: " + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrors({ submit: "Google signup failed: " + result.error });
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ submit: "Google signup failed: " + error.message });
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

      {/* Right Side - Register Form */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button className="auth-tab" onClick={onSwitchToLogin}>Sign In</button>
            <button className="auth-tab active">Sign Up</button>
          </div>

          <div className="form-header">
            <h2>Create Account</h2>
            <p>Join bizBuddy and grow your business</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            {errors.submit && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                {errors.submit}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-buttons">
            <button 
              type="button" 
              className="social-btn google-btn"
              onClick={handleGoogleSignup}
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

          <div className="auth-switch">
            Already have an account? <button onClick={onSwitchToLogin}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
