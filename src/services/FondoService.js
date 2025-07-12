import { api } from 'src/boot/axios'

export const fondoService = {
  // Obtener todos los fondos disponibles
  async obtenerFondos() {
    try {
      const response = await api.get('/v1/Fondos')
      return response.data
    } catch (error) {
      console.error('Error al obtener fondos:', error)
      throw error
    }
  },

  // Obtener detalle de un fondo específico con cálculos
  async obtenerDetalleFondo(fondoId) {
    try {
      const response = await api.get(`/v1/Fondos/${fondoId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle del fondo:', error)
      throw error
    }
  },

  // Calcular el progreso de un fondo
  async calcularProgresoFondo(fondoId) {
    try {
      // Obtener información del fondo
      const fondo = await this.obtenerDetalleFondo(fondoId)

      // Obtener todas las transacciones (depósitos) relacionadas con este fondo
      const responseTransacciones = await api.get('/v1/Transactions')

      // Filtrar solo depósitos de este fondo
      const depositos = responseTransacciones.data.filter(
        (t) => t.tipo === 'Deposito' && t.idFondo === fondoId && t.estado === 'Completado',
      )

      // Calcular total acumulado
      const totalAcumulado = depositos.reduce((sum, deposito) => {
        return sum + parseFloat(deposito.monto || 0)
      }, 0)

      // Calcular porcentaje de progreso
      const porcentajeProgreso = fondo.montoMeta > 0 ? (totalAcumulado / fondo.montoMeta) * 100 : 0

      return {
        fondo,
        totalAcumulado,
        porcentajeProgreso: Math.min(porcentajeProgreso, 100), // No más del 100%
        depositos,
        participantes: this.contarParticipantes(depositos),
      }
    } catch (error) {
      console.error('Error al calcular progreso del fondo:', error)
      throw error
    }
  },

  // Contar participantes únicos en el fondo
  contarParticipantes(depositos) {
    const participantesUnicos = new Set(depositos.map((d) => d.idUsuario))
    return participantesUnicos.size
  },

  // Obtener saldo disponible para retiro
  async obtenerSaldoDisponible(fondoId, usuarioId) {
    try {
      // Obtener todas las transacciones del usuario en este fondo
      const response = await api.get('/v1/Transactions')
      const transacciones = response.data.filter(
        (t) => t.idFondo === fondoId && t.idUsuario === usuarioId,
      )

      // Calcular depósitos del usuario
      const depositos = transacciones
        .filter((t) => t.tipo === 'Deposito' && t.estado === 'Completado')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0)

      // Calcular retiros del usuario
      const retiros = transacciones
        .filter((t) => t.tipo === 'Retiro' && t.estado === 'Completado')
        .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0)

      // Saldo disponible = depósitos - retiros
      return Math.max(depositos - retiros, 0)
    } catch (error) {
      console.error('Error al calcular saldo disponible:', error)
      throw error
    }
  },

  // Formatear montos para mostrar
  formatearMonto(monto) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(monto)
  },

  // Formatear porcentaje
  formatearPorcentaje(porcentaje) {
    return `${porcentaje.toFixed(1)}%`
  },
}
