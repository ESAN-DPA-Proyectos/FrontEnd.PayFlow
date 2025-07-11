<template>
  <q-page class="q-pa-xl historial-page-payflow payflow-page-bg">
    <!-- Título fuera del card para mantener coherencia -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Historial de Transacciones</div>
      </div>
    </div>

    <div class="row items-start q-col-gutter-md q-mb-lg filtros-row-payflow">
      <!-- Card de filtros sin título integrado -->
      <q-card flat bordered class="payflow-shadow filtros-card-compact full-width">
        <!-- Sección de filtros -->
        <div class="q-pa-md">
          <div class="row items-center full-width q-gutter-sm filtros-grid-payflow">
            <q-input
              label="Fondo 1, Fondo 2, ..."
              dense
              v-model="fondoSeleccionado"
              :options="fondos"
              class="filtro-item filtro-underline"
              style="max-width: 180px; min-width: 120px"
              use-input
              use-chips
            />
            <q-input
              label="Desde"
              dense
              v-model="fechaDesde"
              mask="##/##/####"
              :rules="[(val) => !val || val.length === 10 || 'Fecha inválida']"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
              type="date"
            />
            <q-input
              label="Hasta"
              dense
              v-model="fechaHasta"
              mask="##/##/####"
              :rules="[(val) => !val || val.length === 10 || 'Fecha inválida']"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
              type="date"
            />
            <q-select
              label="Por Tipo"
              dense
              v-model="tipoSeleccionado"
              :options="tipos"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-select
              label="Por Estado"
              dense
              v-model="estadoSeleccionado"
              :options="estados"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-select
              label="Por Usuario"
              dense
              v-model="usuarioSeleccionado"
              :options="usuarios"
              class="filtro-item filtro-underline"
              style="max-width: 140px; min-width: 100px"
            />
            <BtnPayflow
              label="Aplicar Filtros"
              color="primary"
              class="filtro-item q-ml-sm"
              style="min-width: 140px"
              @click="aplicarFiltros"
            />
          </div>
        </div>
      </q-card>
    </div>
    <div class="row items-start q-col-gutter-xl">
      <!-- Tabla -->
      <div class="col movimientos-col-payflow">
        <q-card flat bordered class="payflow-shadow q-pa-md movimientos-card">
          <div class="text-subtitle1 text-center q-mb-md">Movimientos</div>
          <div style="overflow-x: auto">
            <table class="tabla-movimientos-payflow">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Referencia</th>
                  <th>Monto</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in rows" :key="i">
                  <td :class="row.tipo === 'Retiro' ? 'text-negative' : 'text-primary'">
                    {{ row.tipo }}
                  </td>
                  <td>{{ row.fecha }}</td>
                  <td>{{ row.referencia }}</td>
                  <td :class="row.tipo === 'Retiro' ? 'text-negative' : 'text-positive'">
                    S/ {{ row.tipo === 'Retiro' ? '-' : '' }}{{ row.monto }}
                  </td>
                  <td>{{ row.usuario }}</td>
                  <td>
                    <span :class="row.estado === 'Pendiente' ? 'text-warning' : 'text-positive'">{{
                      row.estado
                    }}</span>
                  </td>
                  <td>
                    <BtnPayflow
                      label="Detalle"
                      color="primary"
                      size="sm"
                      flat
                      @click="verDetalle(row.referencia)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row justify-between items-center q-mt-md">
            <BtnPayflow label="Anterior" color="primary" :disable="pagina === 1" />
            <div class="text-caption">Página {{ pagina }} de 2</div>
            <BtnPayflow label="Siguiente" color="primary" :disable="pagina === 2" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pagina = 1
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
const rows = ref([...rowsOriginal])
const fondos = ref(['Fondo 1', 'Fondo 2', 'Fondo 3'])
const tipos = ref(['Retiro', 'Depósito'])
const estados = ref(['Pendiente', 'Procesado'])
const usuarios = ref(['gestor.actividad', 'luis.garcia', 'pedro.ruiz', 'rosa.aguilar'])
const fondoSeleccionado = ref('')
const tipoSeleccionado = ref('')
const estadoSeleccionado = ref('')
const usuarioSeleccionado = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')
// Eliminar variables no usadas para el calendario
function aplicarFiltros() {
  let filtrados = [...rowsOriginal]
  if (fondoSeleccionado.value)
    filtrados = filtrados.filter((r) => r.fondo === fondoSeleccionado.value)
  if (tipoSeleccionado.value) filtrados = filtrados.filter((r) => r.tipo === tipoSeleccionado.value)
  if (estadoSeleccionado.value)
    filtrados = filtrados.filter((r) => r.estado === estadoSeleccionado.value)
  if (usuarioSeleccionado.value)
    filtrados = filtrados.filter((r) => r.usuario === usuarioSeleccionado.value)
  if (fechaDesde.value) {
    const desde = fechaDesde.value.split('/').reverse().join('-')
    filtrados = filtrados.filter(
      (r) => new Date(r.fecha.split(' ')[0].split('/').reverse().join('-')) >= new Date(desde),
    )
  }
  if (fechaHasta.value) {
    const hasta = fechaHasta.value.split('/').reverse().join('-')
    filtrados = filtrados.filter(
      (r) => new Date(r.fecha.split(' ')[0].split('/').reverse().join('-')) <= new Date(hasta),
    )
  }
  rows.value = filtrados
}

function verDetalle(referencia) {
  // Extraer el ID de la referencia (ejemplo: #RT-20250422-519 -> 519)
  const id = referencia.split('-').pop()
  router.push({ name: 'detalle-transaccion', params: { id } })
}
</script>

<style lang="scss" scoped>
.q-page.historial-page-payflow {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 32px !important; // Asegurar que el título sea visible
}

@media (max-width: 1100px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 220px;
    max-width: 95vw;
    padding: 12px 8vw !important;
    margin-left: auto;
    margin-right: auto;
  }
}
@media (max-width: 600px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 180px;
    max-width: 98vw;
    padding: 8px 2vw !important;
  }
}
.historial-page-payflow {
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
}
.filtros-row-payflow {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
  display: flex;
  justify-content: center;
}
.filtros-card-compact {
  border-radius: 12px; // Esquinas curvas consistentes
  background: #fff;
  width: fit-content;
  min-width: 240px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  gap: 8px;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: width 0.2s;
  overflow: hidden; // Para mantener las esquinas curvas
}
.filtros-grid-payflow {
  width: 100%;
  flex-wrap: wrap;
  gap: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
@media (max-width: 1100px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 220px;
    max-width: 95vw;
    padding: 12px 8vw !important;
    margin-left: auto;
    margin-right: auto;
  }
  .filtros-grid-payflow {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    width: 100%;
    min-width: 0;
    max-width: 100vw;
    justify-content: center;
  }
}
@media (max-width: 600px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 180px;
    max-width: 98vw;
    padding: 8px 2vw !important;
  }
}
.filtro-item {
  flex: 1 1 0;
  min-width: 120px;
  max-width: 180px;
  border: none;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  box-sizing: border-box;
}
.BtnPayflow.filtro-item {
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  max-width: 200px;
  margin-left: 24px;
}
.movimientos-col-payflow {
  flex: 1 1 0;
  min-width: 0;
  margin-left: 0;
}
.movimientos-card {
  border-radius: 12px; // Esquinas curvas consistentes
  background: #fff;
}
.tabla-movimientos-payflow {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  font-size: 14px;
}
.tabla-movimientos-payflow th,
.tabla-movimientos-payflow td {
  border: 1px solid #d0d0d0;
  padding: 0 8px;
  text-align: left;
  height: 36px;
  white-space: nowrap;
}
.tabla-movimientos-payflow th {
  background: #f8f9fa;
  font-weight: 700;
}
.tabla-movimientos-payflow td {
  font-weight: 400;
}
.text-negative {
  color: #d32f2f !important;
}
.text-positive {
  color: #43a047 !important;
}
.text-warning {
  color: #f9a825 !important;
}
.filtro-underline .q-field__control:after,
.filtro-underline .q-field__control:before,
.filtro-underline .q-field--readonly .q-field__control:after,
.filtro-underline .q-field--readonly .q-field__control:before {
  border-bottom: 2px solid #757575 !important;
  border-radius: 0;
  border-bottom-style: solid !important;
}
.filtro-underline .q-field__control {
  min-height: 44px;
  align-items: flex-end;
}
.filtro-underline .q-field__label {
  top: 12px !important;
  font-size: 15px;
}
.filtro-underline .q-field__native[readonly] {
  color: #212121 !important;
  margin-top: 3px !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 32px !important;
  line-height: 32px !important;
  display: flex;
  align-items: center;
}
.filtro-underline .q-field__append {
  align-items: center !important;
  display: flex;
  height: 32px !important;
}
.filtro-underline .q-icon {
  font-size: 22px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  align-items: center;
}
// Asegurar visibilidad del título en la página de historial
.historial-page-payflow .payflow-section-title {
  display: block !important;
  visibility: visible !important;
  color: #0048bd !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important; // Reducido de 32px a 16px
  z-index: 1;
}
</style>
