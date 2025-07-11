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
              <div class="col-6 text-right">{{ datosRetiro.metodo }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Destino</div>
              <div class="col-6 text-right">{{ datosRetiro.cuenta }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Concepto</div>
              <div class="col-6 text-right">{{ datosRetiro.concepto }}</div>
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
                <BtnPayflow label="Cancelar" flat @click="cancelar" />
              </div>
              <div class="col-auto">
                <BtnPayflow label="Confirmar solicitud de retiro" @click="confirmar" />
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

const router = useRouter()
const datosRetiro = ref({})

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

function confirmar() {
  // Los datos se mantienen para la página de éxito
  router.push({ name: 'retiro-exito' })
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
