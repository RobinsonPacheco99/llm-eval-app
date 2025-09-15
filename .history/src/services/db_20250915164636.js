import dbConfig from '../config/database';

// Base de datos simulada en memoria
class SimulatedDB {
  constructor(config) {
    this.config = config;
    this.data = {
      preguntas: [],
      imagenes: [],
      usuarios: [],
      sesiones: [],
      reset_password: []
    };
    
    // Cargar datos desde localStorage si está habilitado
    if (config.persistToLocalStorage) {
      this.loadFromLocalStorage();
    }
    
    console.log('Base de datos simulada inicializada');
  }
  
  loadFromLocalStorage() {
    try {
      const storedData = localStorage.getItem(this.config.databaseName);
      if (storedData) {
        this.data = JSON.parse(storedData);
        console.log('Datos cargados desde localStorage');
      }
    } catch (error) {
      console.error('Error al cargar datos desde localStorage', error);
    }
  }
  
  saveToLocalStorage() {
    if (this.config.persistToLocalStorage) {
      try {
        localStorage.setItem(this.config.databaseName, JSON.stringify(this.data));
      } catch (error) {
        console.error('Error al guardar datos en localStorage', error);
      }
    }
  }
};

// Crear instancia de la base de datos simulada
const simulatedDB = new SimulatedDB(dbConfig);

// Función para ejecutar consultas simuladas
async function query(text, params) {
  const start = Date.now();
  
  // Simular tiempo de respuesta
  await new Promise(resolve => setTimeout(resolve, dbConfig.simulatedResponseTime));
  
  try {
    // Aquí implementaríamos la lógica para interpretar consultas SQL
    // y devolver resultados simulados basados en simulatedDB.data
    // Por simplicidad, devolvemos resultados simulados básicos
    
    console.log('Consulta simulada ejecutada', { text, params });
    
    // Resultado simulado
    const result = {
      rows: [],
      rowCount: 0
    };
    
    const duration = Date.now() - start;
    console.log('Consulta simulada completada', { duration });
    return result;
  } catch (error) {
    console.error('Error al ejecutar consulta simulada', { text, error });
    throw error;
  }
}

// Función para obtener un cliente simulado
async function getClient() {
  // Crear un cliente simulado con métodos query y release
  const client = {
    query: async (...args) => {
      console.log('Cliente simulado ejecutando consulta', args[0]);
      return await query(args[0], args[1]);
    },
    release: () => {
      console.log('Cliente simulado liberado');
    }
  };
  
  return client;
}

// Al final del archivo
const dbService = {
  query,
  getClient,
  simulatedDB
};

export default dbService;