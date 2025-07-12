<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Eliminar Usuario</div>
        <div class="text-subtitle2">Aquí puedes eliminar usuarios del sistema</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="usuarios"
          :columns="columnas"
          row-key="idUsuario"
          :loading="loading"
          no-data-label="No hay usuarios disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                color="negative"
                label="ELIMINAR"
                @click="eliminarUsuario(props.row)"
                :disable="usuariosEliminados.includes(props.row.idUsuario)"
              />
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
const usuarios = ref([])
const usuariosEliminados = ref([])
const loading = ref(false)

const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'apellido', label: 'Apellido', field: 'apellido', align: 'left' },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await api.get('/api/usuarios')
    usuarios.value = res.data
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar usuarios' })
  } finally {
    loading.value = false
  }
})

async function eliminarUsuario(usuario) {
  try {
    await api.delete(`/api/usuarios/${usuario.idUsuario}`)
    usuariosEliminados.value.push(usuario.idUsuario)
    $q.notify({ type: 'positive', message: 'Usuario eliminado correctamente' })
  } catch {
    $q.notify({ type: 'negative', message: 'Error al eliminar usuario' })
  }
}
</script>
