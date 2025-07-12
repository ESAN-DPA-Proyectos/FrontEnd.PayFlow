<template>
  <q-page class="payflow-success-page q-pa-md bg-grey-1" style="min-height: calc(100vh - 120px)">
    <div class="row justify-center q-pt-lg">
      <div class="column items-center" style="width: 100%; max-width: 600px">
        <div class="payflow-section-title q-mb-xl q-mt-md">Confirmar Solicitud de Retiro</div>
        <q-card
          flat
          bordered
          class="payflow-card-interactive q-pa-lg shadow-2"
          style="max-width: 480px; width: 100%"
        >
          <q-card-section>
            <div class="text-subtitle1 text-bold">Resumen de la operación</div>
            <div class="q-mb-md">Verifica los detalles antes de confirmar</div>
            <q-separator />
            <div class="row q-mt-md">
              <div class="col-6 text-left text-grey-8">Monto a retirar</div>
              <div class="col-6 text-right">S/ {{ datosRetiro.monto }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Método de retiro</div>
              <div class="col-6 text-right">{{ datosRetiro.metodoRetiro }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Beneficiario</div>
              <div class="col-6 text-right">{{ datosRetiro.beneficiario }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Cuenta CCI o celular</div>
              <div class="col-6 text-right">{{ datosRetiro.cuentaDestino }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Concepto</div>
              <div class="col-6 text-right">{{ datosRetiro.concepto }}</div>
            </div>
            <div v-if="transaccionCreada" class="row">
              <div class="col-6 text-left text-grey-8">Fecha de transacción</div>
              <div class="col-6 text-right">
                {{ formatearFecha(transaccionCreada.fechaCreacion) }}
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-bold q-mb-md">
              Tu solicitud de retiro será revisada por un administrador y procesada en un plazo
              máximo de 24 horas.
            </div>
            <div class="row q-col-gutter-md flex flex-center">
              <div class="col-auto">
                <BtnPayflow
                  label="Cancelar"
                  flat
                  @click="cancelar"
                  :disable="cargando || procesando"
                />
              </div>
              <div class="col-auto">
                <BtnPayflow
                  label="Confirmar solicitud de retiro"
                  @click="confirmar"
                  :loading="cargando"
                  :disable="cargando || procesando"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BtnPayflow } from 'src/components/atomos'
import { retiroService } from '../services/retiroService'

const router = useRouter()
const datosRetiro = ref({})
const transaccionCreada = ref(null)
const cargando = ref(false)
const procesando = ref(false) // Nueva bandera para evitar doble procesamiento

onMounted(() => {
  // Obtener datos del sessionStorage
  const datos = sessionStorage.getItem('datosRetiro')
  if (datos) {
    datosRetiro.value = JSON.parse(datos)
  } else {
    // Si no hay datos, redirigir de vuelta a la página de retiro
    router.push({ name: 'retiro' })
  }
})

function cancelar() {
  // Limpiar datos y regresar
  sessionStorage.removeItem('datosRetiro')
  router.push({ name: 'retiro' })
}

async function confirmar() {
  // Evitar múltiples clics y procesamientos
  if (cargando.value || procesando.value) {
    console.log('⚠️ Ya se está procesando la solicitud, ignorando clic adicional')
    return
  }

  try {
    cargando.value = true
    procesando.value = true
    console.log('🔄 Iniciando confirmación de retiro...')
    console.log('📋 Datos a enviar:', datosRetiro.value)

    // Crear la transacción en el backend
    const response = await retiroService.crearSolicitud(datosRetiro.value)
    console.log('✅ Respuesta del backend:', response)

    transaccionCreada.value = response

    // Guardar la respuesta completa para la página de éxito
    const datosCompletos = {
      ...datosRetiro.value,
      transaccion: response,
    }

    console.log('💾 Guardando datos completos en sessionStorage:', datosCompletos)
    sessionStorage.setItem('datosRetiro', JSON.stringify(datosCompletos))

    console.log('🚀 Navegando a retiro-exito...')

    // Navegar inmediatamente sin notificaciones para evitar conflictos
    await router.push({ name: 'retiro-exito' })
  } catch (error) {
    console.error('💥 Error al crear solicitud:', error)
    console.error('💥 Error response:', error.response?.data)
    console.error('💥 Error status:', error.response?.status)

    // Mostrar error simple por ahora
    alert(`Error al crear la solicitud: ${error.response?.data?.message || error.message}`)
  } finally {
    cargando.value = false
    procesando.value = false
  }
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
@media (max-width: 600px) {
  .q-card {
    margin: 0 16px;
    max-width: calc(100vw - 32px) !important;
  }
}
</style>
