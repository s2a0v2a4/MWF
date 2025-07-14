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
          <h1 className="welcome-title">Willkommen zur</h1>
          <h2 className="app-title">Mittweida Events</h2>
          <p className="subtitle">Entdecke Events in deiner Nähe</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Benutzername oder E-Mail
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
                placeholder="Dein Benutzername"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Passwort
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
                placeholder="Dein Passwort"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" className="remember-checkbox" />
              <span className="checkbox-text">Angemeldet bleiben</span>
            </label>
            <button type="button" className="forgot-password">
              Passwort vergessen?
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
                Anmelden...
              </>
            ) : (
              'Anmelden'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="signup-text">
            Noch kein Konto? 
            <button 
              type="button" 
              className="signup-link"
              onClick={() => alert('Registrierung kommt bald! 🚀')}
            >
              Jetzt registrieren
            </button>
          </p>
          
          <div className="social-login">
            <p className="social-text">Oder anmelden mit:</p>
            <div className="social-buttons">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => alert('Google Login kommt bald! 📧')}
              >
                <span className="social-icon">🔗</span>
                Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => alert('Facebook Login kommt bald! 👥')}
              >
                <span className="social-icon">📘</span>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="demo-notice">
        <p>🎭 Demo-Modus: Beliebige Anmeldedaten eingeben</p>
      </div>
    </div>
  );
};

export default LoginPage;

