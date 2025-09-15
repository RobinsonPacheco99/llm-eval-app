# LLM Eval App - Aplicación de Evaluación con Base de Datos Simulada

Esta aplicación permite crear y gestionar preguntas para evaluaciones, utilizando una base de datos simulada en memoria para almacenar la información.

## Características

- Base de datos simulada en memoria
- Persistencia opcional en localStorage
- Autenticación de usuarios simulada
- Generación y gestión de preguntas
- Interfaz de usuario intuitiva

## Configuración

La aplicación utiliza una base de datos simulada en memoria, por lo que no requiere configuración de PostgreSQL ni otras bases de datos externas.

### Scripts disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm start`

Ejecuta la aplicación en modo desarrollo.\
Abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador.

La página se recargará cuando hagas cambios.\
También podrás ver errores de lint en la consola.

### `npm test`

Inicia el ejecutor de pruebas en modo interactivo.

### `npm run build`

Compila la aplicación para producción en la carpeta `build`.\
Empaqueta React en modo producción y optimiza la compilación para el mejor rendimiento.

La compilación está minificada y los nombres de archivo incluyen hashes.\
¡Tu aplicación está lista para ser desplegada!

## Base de Datos Simulada

Esta aplicación utiliza una base de datos simulada en memoria en lugar de PostgreSQL. Las principales características son:

- **Autenticación**: Simulación de registro, inicio de sesión y restablecimiento de contraseña
- **Preguntas**: Almacenamiento y recuperación de preguntas para evaluaciones
- **Imágenes**: Gestión de imágenes asociadas a preguntas
- **Latencia simulada**: Para proporcionar una experiencia realista

### Credenciales de prueba

Para probar la aplicación, puedes utilizar las siguientes credenciales:

- **Email**: test@example.com
- **Contraseña**: password123

## Desarrollo

Si deseas contribuir al proyecto o realizar modificaciones, ten en cuenta que todas las operaciones de base de datos están simuladas en los archivos de servicio correspondientes.

## Estructura del Proyecto

La aplicación está organizada de la siguiente manera:

- `src/services/`: Contiene los servicios simulados para autenticación y gestión de datos
- `src/components/`: Componentes de React para la interfaz de usuario
- `src/context/`: Contextos de React para gestión de estado global
- `src/config/`: Archivos de configuración

## Tecnologías Utilizadas

- React
- React Router
- Context API
- CSS Modules
- Simulación de base de datos en memoria
