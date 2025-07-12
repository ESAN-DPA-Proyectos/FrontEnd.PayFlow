<template>
  <q-page class="q-pa-xl detalle-page-payflow payflow-page-bg">
    <!-- Título fuera del card para mantener coherencia -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Detalle de Transacción</div>
      </div>
    </div>

    <div class="detalle-transaccion-grid q-mx-auto">
      <!-- Panel izquierdo: resumen -->
      <q-card flat bordered class="detalle-card-resumen payflow-card-interactive payflow-shadow">
        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner-dots size="lg" color="primary" />
          <div class="q-mt-sm">Cargando datos...</div>
        </div>
        <div v-else class="text-center q-mb-sm">
          <div class="text-subtitle1 text-weight-bold">
            {{ transaccion?.tipo === 'Retiro' ? 'Solicitud de Retiro' : 'Registro de Depósito' }}
          </div>
          <div class="detalle-monto" :class="transaccion?.tipo === 'Retiro' ? 'text-negative' : 'text-positive'">
            {{ transaccion?.montoFormateado || 'S/ -800.00' }}
          </div>
          <div class="detalle-estado" :class="getStatusClass(transaccion?.estado)">
            {{ transaccion?.estado?.toUpperCase() || 'PENDIENTE' }}
          </div>
        </div>
        <q-separator class="q-my-sm" />
        <table class="detalle-table">
          <tbody>
            <tr>
              <td>Fecha y hora</td>
              <td>{{ transaccion?.fechaFormateada || '22/04/2024 12:30 p.m.' }}</td>
            </tr>
            <tr>
              <td>Referencia</td>
              <td>{{ transaccion?.referencia || 'TXN-RET-240422-0001' }}</td>
            </tr>
            <tr v-if="transaccion?.metodoPago">
              <td>Método de {{ transaccion.tipo === 'Retiro' ? 'retiro' : 'depósito' }}</td>
              <td>{{ transaccion.metodoPago }}</td>
            </tr>
            <tr v-if="transaccion?.cuentaBeneficiario">
              <td>Destino</td>
              <td>{{ transaccion.cuentaBeneficiario }}</td>
            </tr>
            <tr v-if="transaccion?.beneficiarioNombre">
              <td>Beneficiario</td>
              <td>{{ transaccion.beneficiarioNombre }}</td>
            </tr>
            <tr v-if="transaccion?.concepto">
              <td>Concepto</td>
              <td>{{ transaccion.concepto }}</td>
            </tr>
            <tr>
              <td>Estado actual</td>
              <td>{{ getStatusDescription(transaccion?.estado) }}</td>
            </tr>
            <tr>
              <td>Usuario</td>
              <td>{{ transaccion?.usuario || 'gestor.actividad' }}</td>
            </tr>
            <tr v-if="transaccion?.fondo">
              <td>Fondo</td>
              <td>{{ transaccion.fondo }}</td>
            </tr>
          </tbody>
        </table>
      </q-card>

      <!-- Panel derecho: seguimiento -->
      <q-card
        flat
        bordered
        class="detalle-card-seguimiento payflow-card-interactive payflow-shadow"
      >
        <div class="text-subtitle1 text-weight-bold q-mb-md">Seguimiento de la transacción</div>
        <div class="detalle-timeline">
          <div class="timeline-item active">
            <div class="timeline-dot active"></div>
            <div class="timeline-content">
              <div class="timeline-date">22/04/2025 - 12:30 p.m.</div>
              <div class="timeline-title text-weight-bold">Solicitud de retiro registrada</div>
            </div>
            <div class="timeline-line"></div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-label">Pendiente</div>
              <div class="timeline-title text-weight-bold">Revisión por administrador</div>
            </div>
            <div class="timeline-line"></div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-label">Pendiente</div>
              <div class="timeline-title text-weight-bold">Transferencia realizada</div>
            </div>
            <div class="timeline-line"></div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-label">Pendiente</div>
              <div class="timeline-title text-weight-bold">Transacción completada</div>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Botón de volver -->
    <div class="row justify-center q-mt-xl">
      <BtnPayflow
        label="Volver al historial"
        color="secondary"
        outline
        icon="arrow_back"
        @click="volver"
      />
    </div>

    <!-- No transaction found -->
    <div v-if="false" class="text-center q-pa-xl">
      <q-icon name="search_off" size="xl" color="grey-5" />
      <div class="q-mt-md text-h6 text-grey-6">Transacción no encontrada</div>
      <BtnPayflow
        label="Volver al historial"
        color="primary"
        class="q-mt-md"
        @click="goBack"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import TransactionService from 'src/services/TransactionService'

const router = useRouter()
const route = useRoute()

// Estado reactivo
const transaccion = ref(null)
const loading = ref(false)

// Cargar transacción desde la base de datos
onMounted(async () => {
  await cargarTransaccion()
})

async function cargarTransaccion() {
  const id = route.params.id
  if (!id) return

  loading.value = true
  try {
    console.log('Cargando transacción desde BD, ID:', id)
    const transaccionBD = await TransactionService.getTransactionById(id)
    
    if (transaccionBD) {
      transaccion.value = {
        ...transaccionBD,
        fechaFormateada: transaccionBD.fechaFormateada || TransactionService.formatFecha(transaccionBD.fechaRegistro),
        montoFormateado: transaccionBD.montoFormateado || TransactionService.formatMonto(transaccionBD.monto, transaccionBD.tipo)
      }
      console.log('Transacción cargada desde BD:', transaccion.value)
    } else {
      console.log('Transacción no encontrada en BD')
    }
  } catch (error) {
    console.error('Error al cargar transacción:', error)
    console.log('Usando datos mock como fallback')
  } finally {
    loading.value = false
  }
}

function getStatusDescription(estado) {
  const statusMap = {
    'Pendiente': 'Pendiente de procesamiento',
    'Procesado': 'Transacción completada exitosamente',
    'Rechazado': 'Transacción rechazada',
    'En_Proceso': 'En proceso de revisión'
  }
  return statusMap[estado] || 'Estado desconocido'
}

function getStatusClass(estado) {
  switch (estado) {
    case 'Pendiente': return 'text-warning'
    case 'Procesado': return 'text-positive'
    case 'Rechazado': return 'text-negative'
    case 'En_Proceso': return 'text-info'
    default: return 'text-grey'
  }
}

function volver() {
  router.push('/historial')
}

</script>

<style lang="scss" scoped>
.detalle-page-payflow {
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
}

.detalle-page-payflow .payflow-section-title {
  display: block !important;
  visibility: visible !important;
  color: #0048bd !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important;
  z-index: 1;
}

.detalle-transaccion-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1100px;
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .detalle-transaccion-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.detalle-card-resumen,
.detalle-card-seguimiento {
  background: #fff;
  border-radius: 8px;
  padding: 32px 32px 24px 32px;
  min-width: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.07);
}

.detalle-card-resumen {
  min-width: 320px;
}

.detalle-card-seguimiento {
  min-width: 320px;
}

.detalle-monto {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 2px;
}

.detalle-estado {
  font-size: 18px;
  font-weight: 700;
  color: #f9a825 !important;
  margin-bottom: 8px;
}

.detalle-table {
  width: 100%;
  font-size: 15px;
  margin-top: 16px;
  border-collapse: separate;
  border-spacing: 0 4px;
}

.detalle-table td {
  padding: 6px 0 6px 0;
  border-bottom: 1px solid #eee;
  color: #222;
}

.detalle-table td:first-child {
  font-weight: 500;
  color: #666;
  width: 160px;
}

.detalle-timeline {
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  min-height: 56px;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #bdbdbd;
  margin-top: 4px;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #bdbdbd;
  z-index: 2;
}

.timeline-dot.active {
  background: #1565c0;
  box-shadow: 0 0 0 2px #1565c0;
}

.timeline-content {
  flex: 1;
}

.timeline-line {
  position: absolute;
  left: 8px;
  top: 24px;
  width: 0;
  height: calc(100% - 24px);
  border-left: 2px solid #bdbdbd;
  z-index: 1;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-title {
  font-size: 15px;
  margin-bottom: 2px;
}

.timeline-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 2px;
}

.timeline-date {
  font-size: 14px;
  color: #222;
  margin-bottom: 2px;
}

.text-negative {
  color: #d32f2f !important;
}

.text-warning {
  color: #f9a825 !important;
}

// Responsive
@media (max-width: 600px) {
  .detalle-page-payflow .q-page {
    padding: 16px !important;
  }

  .detalle-transaccion-grid {
    gap: 16px;
  }

  .detalle-card-resumen,
  .detalle-card-seguimiento {
    padding: 24px 20px 20px 20px;
    min-width: 280px;
  }

  .detalle-table {
    font-size: 14px;
  }

  .detalle-table td:first-child {
    width: 140px;
  }

  .timeline-title {
    font-size: 14px;
  }
}

@media (max-width: 1100px) {
  .detalle-page-payflow .payflow-section-title {
    text-align: center !important;
  }
}
</style>
