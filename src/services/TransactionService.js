import { api } from 'boot/axios'
import { API_CONFIG } from 'src/config/api'
import FondoService from './FondoService'

export class TransactionService {
  /**
   * Obtiene todas las transacciones con información del fondo
   * @returns {Promise<Array>} Lista de transacciones con datos del fondo
   */
  static async getAllTransactionsWithFondo() {
    try {
      console.log('🔄 Obteniendo transacciones con información de fondos...')
      
      // Obtener transacciones y fondos en paralelo
      const [transacciones, fondos] = await Promise.all([
        this.getAllTransactions(),
        FondoService.getAllFondos()
      ])
      
      console.log('📊 Transacciones obtenidas:', transacciones.length)
      console.log('📂 Fondos obtenidos:', fondos.length)
      
      // Mapear transacciones con información de fondos
      const transaccionesConFondo = transacciones.map(t => {
        const fondo = fondos.find(f => f.idFondo === t.idFondo)
        
        return {
          ...t,
          fondo: fondo ? fondo.nombre : 'Fondo Desconocido',
          fondoCompleto: fondo
        }
      })
      
      console.log('✅ Transacciones con fondos procesadas:', transaccionesConFondo.length)
      return transaccionesConFondo
    } catch (error) {
      console.error('❌ Error al obtener transacciones con fondos:', error)
      
      // Fallback: obtener solo transacciones sin fondos
      const transacciones = await this.getAllTransactions()
      return transacciones.map(t => ({
        ...t,
        fondo: 'Fondo Desconocido',
        fondoCompleto: null
      }))
    }
  }

  /**
   * Obtiene todas las transacciones
   * @returns {Promise<Array>} Lista de transacciones ordenadas por fecha
   */
  static async getAllTransactions() {
    try {
      console.log('🔄 Intentando conectar a la base de datos...')
      // Nota: El endpoint correcto tiene "T" mayúscula según Swagger
      const response = await api.get('/v1/Transactions')
      
      console.log('✅ Datos recibidos de BD:', response.data)
      console.log('📊 Total de transacciones encontradas:', response.data.length)
      
      // Procesar los datos para manejar campos null
      const transaccionesProcesadas = response.data.map((t) => {
        // Determinar si la transacción es de este mes (julio 2025)
        const fechaTransaccion = new Date(t.fechaRegistro || '2025-07-01')
        const esDeEstesMes = fechaTransaccion.getMonth() === 6 && fechaTransaccion.getFullYear() === 2025 // Julio = mes 6
        
        // Asignar fondos según la regla de negocio
        let idFondo
        if (esDeEstesMes) {
          idFondo = 2 // Viaje de promoción a Cusco
        } else {
          idFondo = 4 // Fondo General
        }
        
        return {
          ...t,
          fechaRegistro: t.fechaRegistro || '2025-07-12T00:00:00', // Fecha por defecto de este mes
          referencia: t.referencia || `TXN-${t.idTransaccion}`,
          origenRol: t.origenRol || 'Sistema',
          estado: t.estado || 'Pendiente',
          concepto: t.concepto || 'Sin descripción',
          idFondo: t.idFondo || idFondo // Usar idFondo de BD o asignado según regla
        }
      })
      
      // Ordenar por fecha más reciente primero
      const transacciones = transaccionesProcesadas.sort((a, b) => 
        new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0)
      )
      
      console.log('✅ Transacciones procesadas y ordenadas:', transacciones.length)
      return transacciones
    } catch (error) {
      console.error('❌ Error de conexión a BD:', error.message)
      console.error('📡 URL intentada:', error.config?.url)
      console.error('🔌 Estado de conexión:', error.code)
      
      // Información detallada del error para debug
      if (error.response) {
        console.error('📊 Respuesta del servidor:', error.response.status, error.response.data)
      } else if (error.request) {
        console.error('🌐 No hay respuesta del servidor - posible problema de conexión')
      }
      
      // No retornar datos mock - solo array vacío
      return []
    }
  }

  /**
   * Obtiene una transacción por ID
   * @param {number} id - ID de la transacción
   * @returns {Promise<Object>} Datos de la transacción
   */
  static async getTransactionById(id) {
    try {
      const response = await api.get(`/v1/Transactions/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener transacción por ID:', error)
      // No retornar datos mock - lanzar error
      throw new Error('Transacción no encontrada')
    }
  }

  /**
   * Crea una nueva transacción
   * @param {Object} transactionData - Datos de la transacción
   * @returns {Promise<Object>} Transacción creada
   */
  static async createTransaction(transactionData) {
    try {
      const response = await api.post('/v1/Transactions', transactionData)
      return response.data
    } catch (error) {
      console.error('Error al crear transacción:', error)
      throw error
    }
  }

  /**
   * Actualiza una transacción existente
   * @param {number} id - ID de la transacción
   * @param {Object} transactionData - Datos actualizados
   * @returns {Promise<boolean>} Resultado de la operación
   */
  static async updateTransaction(id, transactionData) {
    try {
      await api.put(`/v1/Transactions/${id}`, transactionData)
      return true
    } catch (error) {
      console.error('Error al actualizar transacción:', error)
      throw error
    }
  }

  /**
   * Sube un archivo de comprobante
   * @param {File} file - Archivo a subir
   * @returns {Promise<Object>} URL del archivo subido
   */
  static async uploadComprobante(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/v1/Transactions/upload-comprobante', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error al subir comprobante:', error)
      throw error
    }
  }

  /**
   * Filtra transacciones por criterios específicos
   * @param {Object} filters - Filtros a aplicar
   * @returns {Promise<Array>} Transacciones filtradas
   */
  static async filterTransactions(filters) {
    try {
      const params = new URLSearchParams()
      
      if (filters.tipo) params.append('tipo', filters.tipo)
      if (filters.estado) params.append('estado', filters.estado)
      if (filters.usuario) params.append('usuario', filters.usuario)
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
      if (filters.fondo) params.append('fondo', filters.fondo)
      
      const response = await api.get(`/v1/Transactions?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error al filtrar transacciones:', error)
      // No usar datos mock - retornar array vacío
      return []
    }
  }

  /**
   * Obtiene el historial de seguimiento de una transacción
   * @param {number} transactionId - ID de la transacción
   * @returns {Promise<Array>} Historial de seguimiento
   */
  static async getTransactionTracking(transactionId) {
    try {
      const response = await api.get(`/v1/Transactions/${transactionId}/tracking`)
      return response.data
    } catch (error) {
      console.error('Error al obtener seguimiento de transacción:', error)
      // No retornar datos mock - lanzar error
      throw new Error('No se pudo obtener el seguimiento de la transacción')
    }
  }

  /**
   * Formatea el monto para mostrar
   * @param {number} monto - Monto a formatear
   * @param {string} tipo - Tipo de transacción
   * @returns {string} Monto formateado
   */
  static formatMonto(monto, tipo) {
    const prefix = tipo === 'Retiro' ? '-' : ''
    return `S/ ${prefix}${Number(monto).toFixed(2)}`
  }

  /**
   * Formatea la fecha para mostrar
   * @param {string} fecha - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  static formatFecha(fecha) {
    const date = new Date(fecha)
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  /**
   * Prueba la conectividad con diferentes endpoints de BD
   * @returns {Promise<Object>} Estado de conectividad
   */
  static async testDatabaseConnection() {
    const results = []
    
    // Probar endpoints estándar primero
    for (const endpoint of API_CONFIG.TRANSACTION_ENDPOINTS) {
      try {
        console.log(`🧪 Probando endpoint: ${endpoint}`)
        const response = await api.get(endpoint, { timeout: API_CONFIG.TIMEOUT })
        console.log(`✅ ${endpoint} - Status: ${response.status}`)
        results.push({ endpoint, status: 'success', data: response.status })
      } catch (error) {
        console.log(`❌ ${endpoint} - Error: ${error.message}`)
        results.push({ endpoint, status: 'error', error: error.message })
      }
    }
    
    // Si todos fallan, probar URLs base alternativas
    if (results.every(r => r.status === 'error')) {
      console.log('🔄 Probando URLs base alternativas...')
      
      for (const baseUrl of API_CONFIG.BASE_URLS) {
        try {
          const testApi = this.createApiInstance(baseUrl)
          const response = await testApi.get('/api/v1/Transactions', { timeout: 3000 })
          console.log(`✅ ${baseUrl} - Conectado!`)
          results.push({ endpoint: baseUrl, status: 'success', data: response.status })
          break // Si encontramos uno que funciona, parar
        } catch (error) {
          console.log(`❌ ${baseUrl} - Error: ${error.message}`)
          results.push({ endpoint: baseUrl, status: 'error', error: error.message })
        }
      }
    }
    
    return results
  }
  
  /**
   * Crea una instancia de API con URL base específica
   */
  static createApiInstance(baseUrl) {
    const axios = require('axios')
    return axios.create({
      baseURL: baseUrl,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS
    })
  }

  /**
   * Datos temporales SOLO para pruebas de interfaz cuando no hay BD disponible
   * NOTA: Estos datos se eliminan cuando la BD esté funcionando
   */
  static getTemporaryTestData() {
    console.warn('⚠️  USANDO DATOS TEMPORALES - NO PARA PRODUCCIÓN')
    return [
      {
        idTransaccion: 999,
        fechaRegistro: new Date().toISOString(),
        referencia: 'TEST-001',
        tipo: 'Retiro',
        monto: 500.00,
        estado: 'Pendiente',
        fondo: 'Fondo Test',
        usuario: 'test.usuario',
        fechaFormateada: this.formatFecha(new Date().toISOString()),
        montoFormateado: 'S/ -500.00'
      },
      {
        idTransaccion: 998,
        fechaRegistro: new Date(Date.now() - 86400000).toISOString(), // Ayer
        referencia: 'TEST-002',
        tipo: 'Depósito',
        monto: 1000.00,
        estado: 'Procesado',
        fondo: 'Fondo Test',
        usuario: 'test.admin',
        fechaFormateada: this.formatFecha(new Date(Date.now() - 86400000).toISOString()),
        montoFormateado: 'S/ 1,000.00'
      }
    ]
  }

}

export default TransactionService
