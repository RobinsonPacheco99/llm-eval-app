import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signInWithEmail, registerWithEmail, signOut, sendPasswordResetEmail, resetPassword } from '../services/auth';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await signInWithEmail({ email, password });
      localStorage.setItem('authToken', userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const userData = await registerWithEmail({ name, email, password });
      localStorage.setItem('authToken', userData.token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await signOut(token);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const resetUserPassword = async (token, newPassword) => {
    try {
      const result = await resetPassword(token, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword: resetUserPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
