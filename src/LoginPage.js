import { useState } from "react";
import "./LoginPage.css";
import { loginUser } from "./supabaseClient";

const LoginPage = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        // Call the success handler to navigate to dashboard
        onLoginSuccess(result.data);
      } else {
        alert("Login failed: Invalid email or password");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <div className="logo-icon">
            <span>&lt;/&gt;</span>
          </div>
        </div>

        <div className="login-header">
          <h1>Login to</h1>
          <h1>bizBuddy</h1>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email or Username</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
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
