<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Notificaciones</div>
        <div class="text-subtitle2">Aquí se listan las actividades importantes en el sistema</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="notificaciones"
          :columns="columnas"
          row-key="idNotificacion"
          flat
          bordered
          dense
          :loading="loading"
          no-data-label="No hay notificaciones disponibles"
        >
          <!-- Estado como badge -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                :color="props.row.estado === 'No Leído' ? 'red' : 'green'"
                :label="props.row.estado"
                transparent
              />
            </q-td>
          </template>

          <!-- Tipo de Notificación como badge -->
          <template v-slot:body-cell-tipoNotificacion="props">
            <q-td :props="props">
              <q-badge color="blue" :label="props.row.tipoNotificacion" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(true)
const notificaciones = ref([])

const columnas = [
  { name: 'mensaje', label: 'Mensaje', field: 'mensaje', align: 'left' },
  {
    name: 'fechaCreacion',
    label: 'Fecha y Hora',
    field: 'fechaCreacion',
    align: 'left',
    format: (val) => new Date(val).toLocaleString(),
  },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  {
    name: 'tipoNotificacion',
    label: 'Tipo',
    field: 'tipoNotificacion',
    align: 'center',
  },
  {
    name: 'nombreUsuario',
    label: 'Usuario',
    field: 'nombreUsuario',
    align: 'left',
  },
  {
    name: 'montoTransaccion',
    label: 'Monto',
    field: 'montoTransaccion',
    align: 'right',
    format: (val) => `S/ ${val.toFixed(2)}`,
  },
  {
    name: 'metodoPago',
    label: 'Método de Pago',
    field: 'metodoPago',
    align: 'left',
  },
]

onMounted(async () => {
  try {
    const res = await api.get('/api/notificaciones')
    notificaciones.value = res.data
  } catch (err) {
    console.error('Error al cargar notificaciones:', err)
    $q.notify({ type: 'negative', message: 'Error al cargar notificaciones' })
  } finally {
    loading.value = false
  }
})
</script>
