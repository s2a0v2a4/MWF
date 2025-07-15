import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './page.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to map page after "login"
      navigate('/map');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="flag-container">
            <div className="german-flag">
              <div className="flag-stripe black"></div>
              <div className="flag-stripe red"></div>
              <div className="flag-stripe yellow"></div>
            </div>
          </div>
          <h1 className="welcome-title">Welcome to</h1>
          <h2 className="app-title">Mittweida Events</h2>
          <p className="subtitle">Discover events in your area</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Username or Email
            </label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="login-input"
                placeholder="Your username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="login-input"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" className="remember-checkbox" />
              <span className="checkbox-text">Stay logged in</span>
            </label>
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-text">
            Don't have an account? 
            <button 
              type="button" 
              className="signup-link"
              onClick={() => alert('Registration coming soon! 🚀')}
            >
              Sign up now
            </button>
          </p>
          
          <div className="social-login">
            <p className="social-text">Or sign in with:</p>
            <div className="social-buttons">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => alert('Google Login coming soon! 📧')}
              >
                <span className="social-icon">🔗</span>
                Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => alert('Facebook Login coming soon! 👥')}
              >
                <span className="social-icon">📘</span>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

