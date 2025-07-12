/**
 * Configuración de API y endpoints alternativos
 */

export const API_CONFIG = {
  // URLs base alternativas para probar
  BASE_URLS: [
    'http://localhost:5000',
    'http://localhost:3000', 
    'http://localhost:8000',
    'http://localhost:7000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:3000'
  ],
  
  // Endpoints de transacciones para probar (basado en Swagger real)
  TRANSACTION_ENDPOINTS: [
    '/api/v1/Transactions',     // El correcto según Swagger
    '/api/v1/transactions',     // Alternativa minúscula
    '/api/Transactions',        // Sin versión
    '/Transactions',            // Directo
    '/transactions'             // Minúscula directo
  ],
  
  // Configuración de timeout
  TIMEOUT: 5000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

export default API_CONFIG
