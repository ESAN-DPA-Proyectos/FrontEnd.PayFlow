<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Asignar Roles a Usuarios</div>
      </q-card-section>

      <q-table
        :rows="usuarios"
        :columns="columnas"
        row-key="idUsuario"
        flat
        bordered
        separator="horizontal"
        class="q-mb-md"
        dense
        :loading="usuarios.length === 0"
      >
        <!-- Columna de Selección de Rol -->
        <template v-slot:body-cell-rolSeleccionado="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.rolSeleccionado"
              :options="roles"
              option-label="nombre"
              option-value="idRol"
              label="Rol"
              dense
              outlined
              emit-value
              map-options
            />
          </q-td>
        </template>

        <!-- Botón Asignar -->
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              label="Asignar"
              color="primary"
              size="sm"
              :loading="saving[props.row.idUsuario]"
              :disable="!props.row.rolSeleccionado || asignado[props.row.idUsuario]"
              @click="asignarRol(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Diálogo de confirmación -->
    <q-dialog v-model="dialogoConfirmacion">
      <q-card>
        <q-card-section class="text-h6"> ¡Asignación exitosa! </q-card-section>

        <q-card-section>
          El rol fue asignado correctamente al usuario seleccionado.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const usuarios = ref([])
const roles = ref([])
const saving = ref({})
const asignado = ref({})
const dialogoConfirmacion = ref(false)

const columnas = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'apellido', label: 'Apellido', field: 'apellido', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  { name: 'usuario', label: 'Usuario', field: 'usuario', align: 'left' },
  { name: 'rolSeleccionado', label: 'Rol', field: 'rolSeleccionado', align: 'left' },
  { name: 'acciones', label: 'Acción', field: 'acciones', align: 'center' },
]

onMounted(async () => {
  try {
    const resUsuarios = await api.get('api/usuarios/listar')
    usuarios.value = resUsuarios.data.map((u) => ({ ...u, rolSeleccionado: null }))
    const resRoles = await api.get('api/roles')
    roles.value = resRoles.data
  } catch (error) {
    console.error('Error al cargar usuarios o roles', error)
    $q.notify({ type: 'negative', message: 'Error al cargar datos del servidor' })
  }
})

async function asignarRol(row) {
  const idUsuario = row.idUsuario
  const idRol = row.rolSeleccionado
  saving.value = { ...saving.value, [idUsuario]: true }

  try {
    await api.post('api/usuarioroles', { idUsuario, idRol })
    asignado.value[idUsuario] = true
    dialogoConfirmacion.value = true
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Error al asignar rol' })
  } finally {
    saving.value = { ...saving.value, [idUsuario]: false }
  }
}
</script>
