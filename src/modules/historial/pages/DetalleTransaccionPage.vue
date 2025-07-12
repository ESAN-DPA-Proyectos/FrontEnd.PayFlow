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
        <div class="text-center q-mb-sm">
          <div class="text-subtitle1 text-weight-bold">Solicitud de Retiro</div>
          <div class="detalle-monto text-negative">S/ -{{ transaccion?.monto || '-' }}</div>
          <div class="detalle-estado text-warning">PENDIENTE</div>
        </div>
        <q-separator class="q-my-sm" />
        <table class="detalle-table">
          <tbody>
            <tr>
              <td>Fecha y hora</td>
              <td>{{ transaccion?.fecha || '-' }}</td>
            </tr>
            <tr>
              <td>Referencia</td>
              <td>{{ transaccion?.referencia || referencia }}</td>
            </tr>
            <tr>
              <td>Método de retiro</td>
              <td>Cuenta bancaria</td>
            </tr>
            <tr>
              <td>Destino</td>
              <td>IBK - 123 - 524895 - 01</td>
            </tr>
            <tr>
              <td>Concepto</td>
              <td>Pago por reserva de hospedaje</td>
            </tr>
            <tr>
              <td>Estado actual</td>
              <td>Pendiente de procesamiento</td>
            </tr>
            <tr>
              <td>Usuario</td>
              <td>{{ transaccion?.usuario || '-' }}</td>
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
  </q-page>
</template>

<script setup>
import { BtnPayflow } from 'src/components/atomos'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const referencia = route.params.referencia || route.params.id

// Buscar la transacción en el historial si no viene por navegación
const rowsOriginal = [
  {
    tipo: 'Retiro',
    fecha: '22/04/2025 12:30 p.m.',
    referencia: '#RT-20250422-519',
    monto: '800.00',
    usuario: 'gestor.actividad',
    estado: 'Pendiente',
  },
  {
    tipo: 'Retiro',
    fecha: '18/04/2025 10:00 a.m.',
    referencia: '#RT-20250418-381',
    monto: '50.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
  {
    tipo: 'Depósito',
    fecha: '14/04/2025 02:32 p.m.',
    referencia: '#DP-20250414-322',
    monto: '1500.00',
    usuario: 'luis.garcia',
    estado: 'Procesado',
  },
  {
    tipo: 'Retiro',
    fecha: '10/04/2025 08:08 a.m.',
    referencia: '#RT-20250410-201',
    monto: '2500.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
  {
    tipo: 'Depósito',
    fecha: '03/04/2025 12:11 a.m.',
    referencia: '#DP-20250403-098',
    monto: '1100.00',
    usuario: 'pedro.ruiz',
    estado: 'Procesado',
  },
  {
    tipo: 'Retiro',
    fecha: '30/03/2025 07:01 a.m.',
    referencia: '#RT-20250330-251',
    monto: '300.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
  {
    tipo: 'Retiro',
    fecha: '25/03/2025 10:23 p.m.',
    referencia: '#RT-20250325-099',
    monto: '100.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
  {
    tipo: 'Depósito',
    fecha: '21/03/2025 09:33 a.m.',
    referencia: '#DP-20250321-080',
    monto: '900.00',
    usuario: 'rosa.aguilar',
    estado: 'Procesado',
  },
  {
    tipo: 'Retiro',
    fecha: '15/03/2025 11:25 p.m.',
    referencia: '#RT-20250315-081',
    monto: '150.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
  {
    tipo: 'Retiro',
    fecha: '02/03/2025 07:31 a.m.',
    referencia: '#RT-20250302-050',
    monto: '200.00',
    usuario: 'gestor.actividad',
    estado: 'Procesado',
  },
]

let transaccion = null
if (window.history.state && window.history.state.transaccion) {
  transaccion = window.history.state.transaccion
} else {
  // Buscar por referencia decodificada
  transaccion = rowsOriginal.find(
    (r) =>
      encodeURIComponent(r.referencia) === referencia ||
      r.referencia === decodeURIComponent(referencia),
  )
}

function volver() {
  router.push({ name: 'historial' })
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
