<template>
  <q-page
    class="payflow-success-page q-pa-md bg-grey-1"
    style="min-height: calc(100vh - 120px); padding-top: 32px"
  >
    <div class="row justify-center">
      <div style="max-width: 600px; width: 100%">
        <div class="payflow-section-title q-mb-lg">Solicitud de Retiro Registrado</div>
        <q-card flat bordered class="payflow-card-interactive shadow-2">
          <q-card-section class="text-center q-pa-lg">
            <q-icon
              name="check_circle"
              size="90px"
              color="positive"
              class="payflow-icon-shadow q-mb-md"
            />
            <div class="text-h6 q-mt-md text-bold" style="color: var(--payflow-primary)">
              ¡Solicitud de retiro registrado correctamente!
            </div>
            <div class="q-mt-sm text-orange-7 text-bold text-subtitle1">PENDIENTE</div>
            <div class="q-mt-lg text-body1" style="line-height: 1.5">
              Tu solicitud de retiro ha sido registrada y será procesada por un administrador del
              fondo
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-lg">
            <div class="text-subtitle1 text-bold q-mb-md" style="color: #424242">
              Detalles de la transacción
            </div>
            <div class="row payflow-row-interactive q-mb-sm q-py-xs">
              <div class="col-6 text-left text-grey-7 text-body2">Monto a retirar</div>
              <div class="col-6 text-right text-bold">S/ {{ datosRetiro.monto }}</div>
            </div>
            <div class="row payflow-row-interactive q-mb-sm q-py-xs">
              <div class="col-6 text-left text-grey-7 text-body2">Método de retiro</div>
              <div class="col-6 text-right">{{ datosRetiro.metodo }}</div>
            </div>
            <div class="row payflow-row-interactive q-mb-sm q-py-xs">
              <div class="col-6 text-left text-grey-7 text-body2">Destino</div>
              <div class="col-6 text-right">{{ datosRetiro.cuenta }}</div>
            </div>
            <div class="row payflow-row-interactive q-mb-sm q-py-xs">
              <div class="col-6 text-left text-grey-7 text-body2">Referencia</div>
              <div class="col-6 text-right text-bold" style="color: var(--payflow-primary)">
                #RT-20250422-402
              </div>
            </div>
            <div class="row payflow-row-interactive q-mb-sm q-py-xs">
              <div class="col-6 text-left text-grey-7 text-body2">Fecha y hora</div>
              <div class="col-6 text-right">22/04/2025 - 12:30 p.m.</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="center" class="q-pa-lg q-gutter-md">
            <BtnPayflow label="Ver historial" color="secondary" outline @click="goHistorial" />
            <BtnPayflow label="Volver al inicio" color="primary" @click="goInicio" />
          </q-card-actions>
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
    // Limpiar datos después de mostrarlos (final del flujo)
    sessionStorage.removeItem('datosRetiro')
  } else {
    // Si no hay datos, redirigir al inicio
    router.push({ name: 'home' })
  }
})

function goHistorial() {
  router.push({ name: 'historial' })
}

function goInicio() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
@media (max-width: 600px) {
  .q-card-actions {
    flex-direction: column;
    gap: 12px;
  }

  .q-card-actions .q-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
