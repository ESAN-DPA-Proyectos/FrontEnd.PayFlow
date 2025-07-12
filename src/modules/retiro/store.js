import { defineStore } from 'pinia'
import { RetiroService } from 'src/services/RetiroService'
import FondoService from 'src/services/FondoService'

export const useRetiroStore = defineStore('retiro', {
  state: () => ({
    // Estado del formulario
    solicitudActual: {
      monto: '',
      beneficiario: '',
      cuentaDestino: '',
      concepto: '', // Vacío por defecto
      metodoRetiro: '', // Vacío por defecto para que el usuario seleccione
      usuarioId: 1,
      fondoId: 1,
    },

    // Estado de la UI
    loading: false,
    loadingTest: false,

    // Historial de retiros
    historialRetiros: [],

    // Configuración
    fondosDisponibles: [],
    metodosRetiro: ['Cuenta bancaria', 'Plin', 'Yape'],
  }),

  getters: {
    // Validar si el formulario está completo
    formularioValido: (state) => {
      return !!(
        state.solicitudActual.monto &&
        state.solicitudActual.beneficiario &&
        state.solicitudActual.cuentaDestino &&
        state.solicitudActual.concepto &&
        state.solicitudActual.metodoRetiro
      )
    },

    // Obtener retiros del usuario actual
    retirosUsuario: (state) => {
      return state.historialRetiros.filter((r) => r.idUsuario === state.solicitudActual.usuarioId)
    },
  },

  actions: {
    // Probar conectividad con el backend
    async probarConectividad() {
      this.loadingTest = true

      try {
        console.log('🩺 Probando endpoint: GET /v1/Transactions')
        const resultado = await RetiroService.testConnection()
        console.log('🎉 Conexión exitosa:', resultado.data)

        return resultado
      } catch (error) {
        console.error('💥 Error de conectividad:', error)
        throw error
      } finally {
        this.loadingTest = false
      }
    },

    // Crear solicitud de retiro
    async crearSolicitud() {
      this.loading = true

      try {
        console.log('🔄 useRetiroStore.crearSolicitud - Datos:', this.solicitudActual)

        // Mapear datos al formato del backend
        const transaccionCreateDTO = {
          tipo: 'Retiro',
          monto: parseFloat(this.solicitudActual.monto),
          estado: 'Pendiente',
          metodoPago: this.solicitudActual.metodoRetiro,
          beneficiarioNombre: this.solicitudActual.beneficiario,
          cuentaBeneficiario: this.solicitudActual.cuentaDestino,
          concepto: this.solicitudActual.concepto,
          idUsuario: this.solicitudActual.usuarioId,
          idFondo: this.solicitudActual.fondoId,
          origenRol: 'Gestor de Actividad',
        }

        console.log('🎯 DTO preparado para backend:', transaccionCreateDTO)
        console.log('📡 Enviando POST a: /v1/Transactions')

        const resultado = await RetiroService.createRetiroRequest(transaccionCreateDTO)

        console.log('✅ Respuesta exitosa del backend:', resultado.data)

        // Guardar en sessionStorage para la confirmación
        const datosRetiro = {
          ...this.solicitudActual,
          id: resultado.data.idTransaccion || resultado.data.id || Math.floor(Math.random() * 1000),
          referencia: resultado.data.referencia || `REF-${Date.now()}`,
          fecha: resultado.data.fechaRegistro || new Date().toISOString(),
          estado: resultado.data.estado || 'Pendiente',
        }

        sessionStorage.setItem('datosRetiro', JSON.stringify(datosRetiro))

        // Limpiar formulario después de crear solicitud exitosa
        this.limpiarFormulario()

        return {
          success: true,
          data: resultado.data,
          solicitud: datosRetiro,
        }
      } catch (error) {
        console.error('💥 Error al crear solicitud de retiro:', error)
        console.error('💥 Error response:', error.response?.data)
        console.error('💥 Error status:', error.response?.status)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Obtener historial de retiros
    async obtenerHistorial(usuarioId = null) {
      try {
        const resultado = await RetiroService.getRetiroHistory(usuarioId)

        this.historialRetiros = resultado.data
        return this.historialRetiros
      } catch (error) {
        console.error('Error al obtener historial de retiros:', error)
        throw error
      }
    },

    // Obtener detalle de una solicitud
    async obtenerDetalle(retiroId) {
      try {
        const resultado = await RetiroService.getRetiroDetail(retiroId)
        return resultado.data
      } catch (error) {
        console.error('Error al obtener detalle del retiro:', error)
        throw error
      }
    },

    // Cancelar solicitud de retiro
    async cancelarSolicitud(retiroId) {
      try {
        const resultado = await RetiroService.cancelRetiroRequest(retiroId)

        // Actualizar historial local
        await this.obtenerHistorial(this.solicitudActual.usuarioId)

        return resultado.data
      } catch (error) {
        console.error('Error al cancelar solicitud de retiro:', error)
        throw error
      }
    },

    // Subir comprobante
    async subirComprobante(archivo) {
      try {
        const resultado = await RetiroService.uploadComprobante(archivo)
        return resultado.data
      } catch (error) {
        console.error('Error al subir comprobante:', error)
        throw error
      }
    },

    // Actualizar datos del formulario
    actualizarSolicitud(campo, valor) {
      this.solicitudActual[campo] = valor
    },

    // Limpiar formulario
    limpiarFormulario() {
      console.log('🧹 Limpiando datos del formulario de retiro')
      this.solicitudActual = {
        monto: '',
        beneficiario: '',
        cuentaDestino: '',
        concepto: '', // Vacío por defecto
        metodoRetiro: '', // Vacío por defecto para que el usuario seleccione
        usuarioId: 1,
        fondoId: 1,
      }

      // También limpiar cualquier estado de carga
      this.loading = false
      this.loadingTest = false
    },

    // Validar formulario
    validarFormulario() {
      const errores = []

      if (!this.solicitudActual.monto) {
        errores.push('El monto es requerido')
      } else if (parseFloat(this.solicitudActual.monto) <= 0) {
        errores.push('El monto debe ser mayor a 0')
      }

      if (!this.solicitudActual.beneficiario) {
        errores.push('El nombre del beneficiario es requerido')
      }

      if (!this.solicitudActual.cuentaDestino) {
        errores.push('La cuenta destino es requerida')
      }

      if (!this.solicitudActual.concepto) {
        errores.push('El concepto es requerido')
      }

      return {
        valido: errores.length === 0,
        errores,
      }
    },

    // Cargar fondos desde la base de datos
    async cargarFondos() {
      try {
        console.log('📂 Cargando fondos desde BD para retiro...')
        const fondosData = await FondoService.getAllFondos()
        console.log('📂 Fondos recibidos:', fondosData)
        
        // Asegurar que fondosData es un array
        const fondosArray = Array.isArray(fondosData) ? fondosData : []
        
        // Formatear fondos para el select
        this.fondosDisponibles = FondoService.formatFondosForSelect(fondosArray)
        console.log('✅ Fondos formateados para retiro:', this.fondosDisponibles)
        
        return this.fondosDisponibles
      } catch (error) {
        console.error('❌ Error al cargar fondos para retiro:', error)
        // Usar fondos por defecto en caso de error
        const fondosDefecto = FondoService.getFondosDefecto()
        this.fondosDisponibles = FondoService.formatFondosForSelect(fondosDefecto)
        console.log('⚠️ Usando fondos por defecto para retiro:', this.fondosDisponibles)
        return this.fondosDisponibles
      }
    },
  },
})
