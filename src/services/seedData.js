// Datos de prueba para la base de datos simulada
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Función para hashear contraseña
function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Usuario de prueba
export const testUser = {
  id: uuidv4(),
  nombre: 'Usuario de Prueba',
  email: 'test@ejemplo.com',
  passwordHash: hashPassword('password123'),
  createdAt: new Date().toISOString(),
  lastLogin: null
};

// Función para inicializar datos de prueba
export function initializeTestData() {
  // Verificar si ya existe el usuario de prueba
  const stored = localStorage.getItem('simulatedDB');
  if (stored) {
    const data = JSON.parse(stored);
    const existingUser = data.usuarios?.find(u => u.email === testUser.email);
    
    if (!existingUser) {
      // Agregar usuario de prueba
      data.usuarios = data.usuarios || [];
      data.usuarios.push(testUser);
      localStorage.setItem('simulatedDB', JSON.stringify(data));
      console.log('Usuario de prueba creado:', testUser.email);
    } else {
      console.log('Usuario de prueba ya existe:', testUser.email);
    }
  } else {
    // Crear estructura inicial con usuario de prueba
    const initialData = {
      usuarios: [testUser],
      sesiones: [],
      reset_password: []
    };
    localStorage.setItem('simulatedDB', JSON.stringify(initialData));
    console.log('Base de datos inicializada con usuario de prueba:', testUser.email);
  }
}
