<template>
  <div class="notificaciones-config q-pa-xl payflow-page-bg">
    <div class="row justify-center q-mt-xl">
      <q-card flat bordered class="payflow-card-interactive tabla-notificaciones q-pa-xl">
        <div class="row q-col-gutter-xl q-mb-md">
          <div class="col-12 flex items-center">
            <div class="payflow-section-title">Notificaciones</div>
          </div>
        </div>
        <q-table
          :rows="notificaciones.lista"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <template #body-cell-estado="props">
            <q-td :props="props">
              <q-badge :color="badgeColor(props.row.estado)">
                {{ props.row.estado }}
              </q-badge>
            </q-td>
          </template>
          <template #body-cell-leido="props">
            <q-td :props="props">
              <q-badge color="grey" v-if="props.row.leido">Leído</q-badge>
              <q-badge color="red" v-else>Nuevo</q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useNotificacionesStore } from 'src/modules/notificaciones/store'

const notificaciones = useNotificacionesStore()

const columns = [
  { name: 'mensaje', label: 'Mensaje', field: 'mensaje', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
  { name: 'leido', label: 'Atención', field: 'leido', align: 'left' },
]

function badgeColor(estado) {
  if (estado === 'Aprobado') return 'green'
  if (estado === 'Rechazado') return 'red'
  return 'orange'
}
</script>

<style scoped>
.notificaciones-config {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
}
.tabla-notificaciones {
  border-radius: 12px;
  width: 100%;
}
</style>
