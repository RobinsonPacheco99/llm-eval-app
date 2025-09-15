import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import fondoImg from '../../fondo.png';

export default function Register({ onLogin, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            Crear Cuenta
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            required
            className="auth-input"
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="auth-input"
          />
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="btn btn-register"
          >
            Ya tengo cuenta
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
