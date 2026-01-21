import { useState } from "react";
import "./LoginPage.css";
import { loginUser } from "./supabaseClient";
import BizBuddyLogo from "./BizBuddyLogo";

const LoginPage = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Real-time validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched.email) {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    setTouched({
      email: true,
      password: true
    });
    
    return !emailError && !passwordError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        // Call the success handler to navigate to dashboard
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

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <div className="logo-icon">
            <BizBuddyLogo size={50} />
          </div>
        </div>

        <div className="login-header">
          <h1>Login to</h1>
          <h1>bizBuddy</h1>
        </div>

        <form onSubmit={handleLogin} className="login-form" noValidate>
          {errors.submit && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur('email')}
              placeholder="your.email@example.com"
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading || Object.values(errors).some(error => error)}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="register-link">
          <span>Don't have an account? </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
          >
            Register
          </a>
        </div>
      </div>

      <footer className="login-footer">
        © 2025 bizBuddy. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
