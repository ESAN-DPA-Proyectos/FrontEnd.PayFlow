import { api } from 'src/boot/axios'

/**
 * RetiroService - Servicio global para operaciones de retiro
 * Maneja las llamadas HTTP relacionadas con solicitudes de retiro
 */
export const RetiroService = {
  /**
   * Probar conectividad con el backend
   */
  async testConnection() {
    try {
      const response = await api.get('/v1/Transactions')
      return {
        success: true,
        data: response.data,
        endpoint: '/v1/Transactions',
      }
    } catch (error) {
      console.error('Error al probar conectividad:', error)
      throw error
    }
  },

  /**
   * Crear una nueva solicitud de retiro
   */
  async createRetiroRequest(retiroData) {
    try {
      const response = await api.post('/v1/Transactions', retiroData)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error al crear solicitud de retiro:', error)
      throw error
    }
  },

  /**
   * Obtener historial de retiros
   */
  async getRetiroHistory(usuarioId = null) {
    try {
      const response = await api.get('/v1/Transactions')

      // Filtrar solo retiros
      let retiros = response.data.filter((t) => t.tipo === 'Retiro')

      // Filtrar por usuario si se especifica
      if (usuarioId) {
        retiros = retiros.filter((r) => r.idUsuario === usuarioId)
      }

      return {
        success: true,
        data: retiros,
      }
    } catch (error) {
      console.error('Error al obtener historial de retiros:', error)
      throw error
    }
  },

  /**
   * Obtener detalle de una solicitud específica
   */
  async getRetiroDetail(retiroId) {
    try {
      const response = await api.get(`/v1/Transactions/${retiroId}`)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error al obtener detalle del retiro:', error)
      throw error
    }
  },

  /**
   * Cancelar/rechazar una solicitud de retiro
   */
  async cancelRetiroRequest(retiroId) {
    try {
      // Primero obtener la transacción actual
      const detailResponse = await this.getRetiroDetail(retiroId)

      // Actualizar el estado a 'Rechazado'
      const updatedTransaction = {
        ...detailResponse.data,
        estado: 'Rechazado',
      }

      const response = await api.put(`/v1/Transactions/${retiroId}`, updatedTransaction)
      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error al cancelar solicitud de retiro:', error)
      throw error
    }
  },

  /**
   * Subir comprobante de retiro
   */
  async uploadComprobante(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/v1/Transactions/upload-comprobante', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error) {
      console.error('Error al subir comprobante:', error)
      throw error
    }
  },
}

export default RetiroService
