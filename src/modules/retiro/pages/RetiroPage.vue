<template>
  <q-page class="q-pa-xl payflow-page-bg">
    <div class="payflow-section-title q-mb-xl">Registrar Solicitud de Retiro</div>

    <div class="retiro-container">
      <div class="retiro-info">
        <div class="retiro-label">Información del fondo</div>
        <q-select
          label="Seleccionar fondo"
          :options="fondos"
          v-model="fondoSeleccionado"
          filled
          class="q-mb-md"
        />
        <div class="q-mb-sm"><b>Saldo disponible:</b> S/ 2,800.00</div>
        <div class="q-mb-sm"><b>Meta</b> S/ 15,000.00</div>
        <div><b>Progreso</b> 18.7 %</div>
      </div>
      <div class="retiro-form">
        <div class="retiro-label">Detalles de solicitud de retiro</div>
        <q-form class="q-mt-md" @submit.prevent="irAConfirmacion">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input label="Monto a retirar" prefix="S/" filled class="q-mb-md" v-model="monto" />
            </div>
            <div class="col-6">
              <q-select
                label="Método de retiro"
                :options="metodosRetiro"
                filled
                class="q-mb-md"
                v-model="metodo"
                emit-value
                map-options
              />
            </div>
          </div>
          <q-input label="Nombre del beneficiario" filled class="q-mb-md" v-model="beneficiario" />
          <q-input label="Cuenta CCI o celular" filled class="q-mb-md" v-model="cuenta" />
          <q-input label="Concepto" type="textarea" filled class="q-mb-md" v-model="concepto" />
          <div class="retiro-btns">
            <q-btn label="Cancelar" class="retiro-btn-cancelar" flat />
            <BtnPayflow
              label="Continuar"
              class="retiro-btn-continuar"
              :disable="!formularioValido"
              :loading="loading"
              type="submit"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { BtnPayflow } from 'src/components/atomos'
import { useRetiroStore } from '../store'

export default {
  name: 'RetiroPage',
  components: { BtnPayflow },
  data() {
    return {
      retiroStore: useRetiroStore(),
      metodosRetiro: [
        { label: 'Cuenta bancaria', value: 'Cuenta bancaria' },
        { label: 'Plin', value: 'Plin' },
        { label: 'Yape', value: 'Yape' },
      ],
    }
  },

  // Limpiar formulario al entrar a la página
  mounted() {
    console.log('🧹 Limpiando formulario al cargar página de retiro')
    this.retiroStore.limpiarFormulario()
  },

  computed: {
    // Mapear datos del store al componente
    fondoSeleccionado: {
      get() {
        return this.retiroStore.solicitudActual.fondoId
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('fondoId', value)
      },
    },
    monto: {
      get() {
        return this.retiroStore.solicitudActual.monto
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('monto', value)
      },
    },
    beneficiario: {
      get() {
        return this.retiroStore.solicitudActual.beneficiario
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('beneficiario', value)
      },
    },
    cuenta: {
      get() {
        return this.retiroStore.solicitudActual.cuentaDestino
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('cuentaDestino', value)
      },
    },
    concepto: {
      get() {
        return this.retiroStore.solicitudActual.concepto
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('concepto', value)
      },
    },
    metodo: {
      get() {
        return this.retiroStore.solicitudActual.metodoRetiro
      },
      set(value) {
        this.retiroStore.actualizarSolicitud('metodoRetiro', value)
      },
    },

    // Estados del store
    loading() {
      return this.retiroStore.loading
    },
    fondos() {
      return this.retiroStore.fondosDisponibles
    },
    formularioValido() {
      return this.retiroStore.formularioValido
    },
  },
  methods: {
    async irAConfirmacion() {
      console.log('🚀 Validando formulario para continuar...')

      // Validar usando el store
      const validacion = this.retiroStore.validarFormulario()
      if (!validacion.valido) {
        alert(`⚠️ ${validacion.errores.join(', ')}`)
        return
      }

      try {
        console.log('✅ Formulario válido, preparando datos...')

        // Obtener todos los datos del formulario
        const datosRetiro = {
          monto: this.monto,
          metodoRetiro: this.metodo,
          beneficiario: this.beneficiario,
          cuentaDestino: this.cuenta, // Corregido: usar this.cuenta en lugar de this.cuentaDestino
          concepto: this.concepto,
          usuarioId: 1, // Simulado
          fondoId: 1, // Simulado
        }

        console.log('💾 Guardando datos en sessionStorage:', datosRetiro)

        // Guardar en sessionStorage para la página de confirmación
        sessionStorage.setItem('datosRetiro', JSON.stringify(datosRetiro))

        console.log('🔄 Navegando a página de confirmación...')

        // Navegar a confirmación (SIN crear la solicitud todavía)
        this.$router.push({ name: 'retiro-confirmar' })
      } catch (error) {
        console.error('Error al preparar datos:', error)
        alert(`❌ Error: ${error.message}`)
      }
    },
  },
}
</script>

<style scoped></style>
