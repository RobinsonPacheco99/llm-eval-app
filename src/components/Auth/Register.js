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
            Crear Cuenta
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="name" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Nombre completo</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            required
            className="auth-input"
            style={{ padding: '16px 20px', fontSize: '16px', height: '56px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="email" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="auth-input"
            style={{ padding: '16px 20px', fontSize: '16px', height: '56px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="password" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="auth-input"
            style={{ padding: '16px 20px', fontSize: '16px', height: '56px' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="confirmPassword" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="auth-input"
            style={{ padding: '16px 20px', fontSize: '16px', height: '56px' }}
          />
        </div>

        {error && (
          <div className="error-message" style={{ fontSize: '16px', padding: '16px 20px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div className="auth-buttons" style={{ marginTop: '25px' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-login"
            style={{ padding: '16px 24px', fontSize: '16px', fontWeight: '600' }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="btn btn-register"
            style={{ padding: '16px 24px', fontSize: '16px', fontWeight: '600' }}
          >
            Ya tengo cuenta
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}
