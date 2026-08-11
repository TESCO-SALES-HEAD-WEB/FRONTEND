import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { setSession } from '../api/client';
import './Login.css';

// Sales Head portal credentials
const SALES_HEAD = {
  email: 'salestescostructures@gmail.com',
  password: 'head123',
  name: 'Sales Head',
  role: 'Sales Head',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Already signed in? Go straight to the dashboard.
  useEffect(() => {
    if (localStorage.getItem('crm_authenticated') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate against the Sales Head credentials
    setTimeout(() => {
      const emailOk = email.trim().toLowerCase() === SALES_HEAD.email;
      const passOk = password === SALES_HEAD.password;

      if (emailOk && passOk) {
        setSession('sales-head-session', { name: SALES_HEAD.name, email: SALES_HEAD.email, role: SALES_HEAD.role });
        navigate('/dashboard', { replace: true });
      } else {
        setIsLoading(false);
        setError('Invalid email or password. Please try again.');
      }
    }, 700);
  };

  return (
    <div className="login-container">
      <div className="login-brand">
        <div className="login-brand__content">
          <h1>Sales Head Portal</h1>
          <p>Control tower for your organization's sales operations.</p>
        </div>
      </div>

      <div className="login-form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form__header">
            <h2>Welcome back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="login-form__error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn__loading-spinner"></span>
            ) : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
