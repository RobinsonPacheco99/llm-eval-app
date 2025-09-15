import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import fondoImg from '../../fondo.png';

export default function Login({ onRegister, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayConnected, setStayConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu email primero');
      return;
    }

    try {
      await forgotPassword(email);
      setError('');
      alert('Se ha enviado un enlace de recuperación a tu email');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <div 
            className="auth-logo"
            style={{
              backgroundImage: `url(${fondoImg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '160px',
              width: '100%',
              marginBottom: '20px',
              position: 'relative'
            }}
          />
          <div 
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(36,149,255,0.3), rgba(30,127,224,0.3), transparent)',
              margin: '20px 0',
              borderRadius: '1px'
            }}
          />
          <h2 style={{ 
            textAlign: 'center', 
            margin: '0 0 30px 0', 
            color: '#0f172a',
            fontSize: '28px',
            fontWeight: '800'
          }}>
            Bienvenidos
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="auth-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="auth-input"
          />
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={stayConnected}
              onChange={(e) => setStayConnected(e.target.checked)}
            />
            <span>Stay connected</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-link"
          >
            Olvidé mi contraseña
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="auth-buttons">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-login"
          >
            {loading ? 'Iniciando...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="btn btn-register"
          >
            Regístrate
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
