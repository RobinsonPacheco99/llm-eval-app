// Servicio de autenticación con base de datos simulada
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { initializeTestData } from './seedData';

// Base de datos simulada en memoria
const simulatedDB = {
  usuarios: [],
  sesiones: [],
  reset_password: []
};

// Cargar datos desde localStorage si existen
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('simulatedDB');
    if (stored) {
      const data = JSON.parse(stored);
      simulatedDB.usuarios = data.usuarios || [];
      simulatedDB.sesiones = data.sesiones || [];
      simulatedDB.reset_password = data.reset_password || [];
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
};

// Guardar datos en localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem('simulatedDB', JSON.stringify(simulatedDB));
  } catch (error) {
    console.error('Error al guardar datos:', error);
  }
};

// Inicializar datos
loadFromStorage();
initializeTestData();

// Función para hashear contraseña
function hashPassword(password) {
  try {
    return bcrypt.hashSync(password, 10);
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    throw new Error('Error al procesar contraseña');
  }
}

// Función para verificar contraseña
function verifyPassword(password, hash) {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    return false;
  }
}

// Obtener usuario actual por token de sesión
export async function getCurrentUser(token) {
  if (!token) return null;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const session = simulatedDB.sesiones.find(s => s.token === token);
    if (!session) return null;
    
    const user = simulatedDB.usuarios.find(u => u.id === session.userId);
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.nombre,
      email: user.email,
      provider: 'password',
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.email)}`
    };
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail({ email, password }) {
  if (!email || !password) throw new Error('Credenciales inválidas');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = simulatedDB.usuarios.find(u => u.email === email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    if (!verifyPassword(password, user.passwordHash)) {
      throw new Error('Credenciales inválidas');
    }
    
    const token = uuidv4();
    
    const session = {
      id: uuidv4(),
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    simulatedDB.sesiones.push(session);
    saveToStorage();
    
    return {
      id: user.id,
      name: user.nombre,
      email: user.email,
      provider: 'password',
      token,
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(user.email)}`
    };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Registrar nuevo usuario
export async function registerWithEmail({ name, email, password }) {
  if (!name || !email || !password) throw new Error('Datos incompletos');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = simulatedDB.usuarios.find(u => u.email === email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    const userId = uuidv4();
    const passwordHash = hashPassword(password);
    
    const newUser = {
      id: userId,
      nombre: name,
      email: email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    simulatedDB.usuarios.push(newUser);
    
    const token = uuidv4();
    
    const session = {
      id: uuidv4(),
      token,
      userId: userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    simulatedDB.sesiones.push(session);
    saveToStorage();
    
    return {
      id: userId,
      name,
      email,
      provider: 'password',
      token,
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(email)}`
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}

// Cerrar sesión
export async function signOut(token) {
  if (!token) return;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const sessionIndex = simulatedDB.sesiones.findIndex(s => s.token === token);
    if (sessionIndex !== -1) {
      simulatedDB.sesiones.splice(sessionIndex, 1);
      saveToStorage();
    }
    
    console.log('Sesión cerrada:', token);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Enviar correo para restablecer contraseña
export async function sendPasswordResetEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = simulatedDB.usuarios.find(u => u.email === email);
    if (!user) {
      throw new Error('Email no encontrado');
    }
    
    const resetToken = uuidv4();
    
    const resetRequest = {
      id: uuidv4(),
      email: email,
      token: resetToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      used: false
    };
    
    simulatedDB.reset_password.push(resetRequest);
    saveToStorage();
    
    console.log('Correo de restablecimiento enviado a:', email);
    console.log(`Token de restablecimiento para ${email}: ${resetToken}`);
    
    return true;
  } catch (error) {
    console.error('Error al enviar correo de restablecimiento:', error);
    throw error;
  }
}

// Restablecer contraseña con token
export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Datos incompletos');
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const resetRequest = simulatedDB.reset_password.find(r => 
      r.token === token && 
      !r.used && 
      new Date(r.expiresAt) > new Date()
    );
    
    if (!resetRequest) {
      throw new Error('Token inválido o expirado');
    }
    
    const user = simulatedDB.usuarios.find(u => u.email === resetRequest.email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    user.passwordHash = hashPassword(newPassword);
    resetRequest.used = true;
    
    saveToStorage();
    
    console.log(`Contraseña actualizada para ${user.email}`);
    
    return { email: user.email };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
}
