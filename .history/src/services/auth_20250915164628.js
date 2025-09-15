// Servicio de autenticación con base de datos simulada
// Este servicio simula la autenticación de usuarios con datos en memoria
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from './db';

// Función para verificar contraseña (simulada)
// En un entorno real, esta verificación se haría en el backend
// Función para verificar contraseña (simulada)
function verifyPassword(password, hash) {
  // Simulación simple para desarrollo
  try {
    // Temporalmente devolver true para evitar el error con bcryptjs
    console.log('Verificación de contraseña simulada');
    return true; // Simulamos que la contraseña es correcta
  } catch (error) {
    console.error('Error al verificar contraseña:', error);
    return false;
  }
}
// En un entorno real, esta verificación se haría en el backend
function verifyPassword(password, hash) {
  // Simulación simple para desarrollo
  // En producción, esto sería una llamada a API al backend
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
    // Simular búsqueda de sesión válida en la base de datos simulada
    await new Promise(resolve => setTimeout(resolve, 100)); // Simular latencia
    
    // Datos de usuario simulados
    const userData = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      nombre: 'Usuario Simulado',
      email: 'usuario@ejemplo.com',
      ultima_conexion: new Date().toISOString()
    };
    
    // Formatear datos del usuario para el frontend
    return {
      id: userData.id,
      name: userData.nombre,
      email: userData.email,
      provider: 'password',
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(userData.email)}`
    };
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

// Iniciar sesión con email y contraseña (simulado)
export async function signInWithEmail({ email, password }) {
  if (!email || !password) throw new Error('Credenciales inválidas');
  
  try {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Credenciales de prueba para desarrollo
    const validCredentials = {
      email: 'usuario@ejemplo.com',
      password: 'password123',
      id: '550e8400-e29b-41d4-a716-446655440000',
      nombre: 'Usuario Simulado'
    };
    
    // Verificar credenciales
    if (email !== validCredentials.email || password !== validCredentials.password) {
      throw new Error('Credenciales inválidas');
    }
    
    // Crear token de sesión
    const token = uuidv4();
    
    // Datos simulados - no se guarda realmente en base de datos
    
    // Formatear datos del usuario para el frontend
    return {
      id: validCredentials.id,
      name: validCredentials.nombre,
      email: validCredentials.email,
      provider: 'password',
      token,
      avatarUrl: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(validCredentials.email)}`
    };
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}

// Registrar nuevo usuario (simulado)
export async function registerWithEmail({ name, email, password }) {
  if (!name || !email || !password) throw new Error('Datos incompletos');
  
  try {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular verificación de email
    if (email === 'usuario@ejemplo.com') {
      throw new Error('El email ya está registrado');
    }
    
    // Generar ID único para el nuevo usuario
    const userId = uuidv4();
    
    // Generar avatar URL
    const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(email)}`;
    
    // Crear token de sesión
    const token = uuidv4();
    
    // En una aplicación real, aquí guardaríamos el usuario y la sesión en la base de datos
    
    // Formatear datos del usuario para el frontend
    return {
      id: userId,
      name,
      email,
      provider: 'password',
      token,
      avatarUrl
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}

// Cerrar sesión (simulado)
export async function signOut(token) {
  if (!token) return;
  
  try {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // En una aplicación real, aquí eliminaríamos la sesión de la base de datos
    console.log('Sesión cerrada:', token);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}

// Enviar correo para restablecer contraseña (simulado)
export async function sendPasswordResetEmail(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }
  
  try {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // En una aplicación real, verificaríamos si el email existe
    // y enviaríamos un correo con un enlace para restablecer la contraseña
    console.log('Correo de restablecimiento enviado a:', email);
    
    // Generar token de restablecimiento simulado
    const token = uuidv4();
    
    // Aquí se enviaría el correo con el token
    console.log(`Token de restablecimiento para ${email}: ${token}`);
    
    return true;
  } catch (error) {
    console.error('Error al enviar correo de restablecimiento:', error);
    throw error;
  }
}

// Restablecer contraseña con token (simulado)
export async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new Error('Datos incompletos');
  }
  
  try {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Simular verificación de token
    // En una aplicación real, verificaríamos si el token existe y no ha expirado
    
    // Simular verificación de token
    if (token !== 'token-valido-simulado') {
      throw new Error('Token inválido o expirado');
    }
    
    // Simular email del usuario
    const userEmail = 'usuario@ejemplo.com';
    
    // En una aplicación real, aquí actualizaríamos la contraseña en la base de datos
    console.log(`Contraseña actualizada para ${userEmail}`);
    
    return { email: userEmail };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
}


