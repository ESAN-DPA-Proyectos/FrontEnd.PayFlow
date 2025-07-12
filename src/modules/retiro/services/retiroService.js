import { api } from 'src/boot/axios'

export const retiroService = {
  // Probar conectividad con el backend
  async probarConectividad() {
    try {
      const response = await api.get('/v1/Transactions') // Usar endpoint existente
      return response.data
    } catch (error) {
      console.error('Error al probar conectividad:', error)
      throw error
    }
  },

  // Crear solicitud de retiro
  async crearSolicitud(datosRetiro) {
    try {
      console.log('🔄 retiroService.crearSolicitud - Datos recibidos:', datosRetiro)

      // Mapear datos del frontend al formato que espera tu backend
      const transaccionCreateDTO = {
        tipo: 'Retiro',
        monto: datosRetiro.monto,
        estado: 'Pendiente',
        metodoPago: datosRetiro.metodoRetiro,
        beneficiarioNombre: datosRetiro.beneficiario,
        cuentaBeneficiario: datosRetiro.cuentaDestino,
        concepto: datosRetiro.concepto,
        idUsuario: datosRetiro.usuarioId || 1,
        idFondo: datosRetiro.fondoId || 1,
        origenRol: 'Gestor de Actividad',
      }

      console.log('🎯 DTO preparado para backend:', transaccionCreateDTO)
      console.log('📡 Enviando POST a: /v1/Transactions')

      const response = await api.post('/v1/Transactions', transaccionCreateDTO)

      console.log('✅ Respuesta exitosa del backend:', response.data)
      return response.data
    } catch (error) {
      console.error('💥 Error al crear solicitud de retiro:', error)
      console.error('💥 Error response:', error.response?.data)
      console.error('💥 Error status:', error.response?.status)
      throw error
    }
  },

  // Obtener historial de retiros
  async obtenerHistorial(usuarioId) {
    try {
      // Obtener todas las transacciones y filtrar por usuario en el frontend
      // (idealmente esto se haría en el backend)
      const response = await api.get('/v1/Transactions')

      // Filtrar solo retiros del usuario específico
      const retiros = response.data.filter((t) => t.tipo === 'Retiro' && t.idUsuario === usuarioId)

      return retiros
    } catch (error) {
      console.error('Error al obtener historial de retiros:', error)
      throw error
    }
  },

  // Obtener detalle de una solicitud
  async obtenerDetalle(retiroId) {
    try {
      const response = await api.get(`/v1/Transactions/${retiroId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle del retiro:', error)
      throw error
    }
  },

  // Cancelar solicitud de retiro (actualizar estado)
  async cancelarSolicitud(retiroId) {
    try {
      // Primero obtener la transacción actual
      const transaccion = await this.obtenerDetalle(retiroId)

      // Actualizar el estado a 'Rechazado'
      const transaccionActualizada = {
        ...transaccion,
        estado: 'Rechazado',
      }

      const response = await api.put(`/v1/Transactions/${retiroId}`, transaccionActualizada)
      return response.data
    } catch (error) {
      console.error('Error al cancelar solicitud de retiro:', error)
      throw error
    }
  },

  // Subir comprobante
  async subirComprobante(archivo) {
    try {
      const formData = new FormData()
      formData.append('file', archivo)

      const response = await api.post('/v1/Transactions/upload-comprobante', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      console.error('Error al subir comprobante:', error)
      throw error
    }
  },
}
