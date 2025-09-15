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
      <div className="auth-form" style={{ padding: '60px', maxWidth: '520px' }}>
        <div className="auth-header">
          <div 
            className="auth-logo"
            style={{
              backgroundImage: `url(${fondoImg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '180px',
              width: '100%',
              marginBottom: '30px',
              position: 'relative'
            }}
          />
          <div 
            style={{
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(36,149,255,0.3), rgba(30,127,224,0.3), transparent)',
              margin: '25px 0',
              borderRadius: '1px'
            }}
          />
          <h2 style={{ 
            textAlign: 'center', 
            margin: '0 0 40px 0', 
            color: '#0f172a',
            fontSize: '32px',
            fontWeight: '800'
          }}>
            Bienvenidos
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label htmlFor="email" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="auth-input"
            style={{ padding: '18px 22px', fontSize: '16px', height: '60px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '30px' }}>
          <label htmlFor="password" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="auth-input"
            style={{ padding: '18px 22px', fontSize: '16px', height: '60px' }}
          />
        </div>

        <div className="form-options" style={{ marginBottom: '25px' }}>
          <label className="checkbox-label" style={{ fontSize: '15px' }}>
            <input
              type="checkbox"
              checked={stayConnected}
              onChange={(e) => setStayConnected(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <span>Stay connected</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="forgot-password-link"
            style={{ fontSize: '15px' }}
          >
            Olvidé mi contraseña
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ fontSize: '16px', padding: '16px 20px', marginBottom: '25px' }}>
            {error}
          </div>
        )}

        <div className="auth-buttons" style={{ marginTop: '35px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-login"
            style={{ padding: '18px 28px', fontSize: '16px', fontWeight: '600' }}
          >
            {loading ? 'Iniciando...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="btn btn-register"
            style={{ padding: '18px 28px', fontSize: '16px', fontWeight: '600' }}
          >
            Regístrate
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
