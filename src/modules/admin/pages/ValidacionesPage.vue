<template>
  <div class="validaciones q-pa-xl">
    <div class="text-h6 text-primary q-mb-lg" style="font-size: 22px">
      COMPROBANTES PARA VALIDAR
    </div>
    <div class="row q-col-gutter-xl q-mb-md">
      <div class="col-8">
        <q-input filled dense placeholder="Digitar ..." v-model="busqueda" class="input-busqueda" />
        <q-btn
          color="primary"
          class="q-ml-md"
          style="min-width: 100px"
          label="BUSCAR"
          @click="buscar"
        />
      </div>
      <div class="col-4">
        <q-card flat bordered class="q-pa-md filtro-card">
          <q-radio v-model="filtro" val="dni" label="POR D.N.I." color="primary" />
          <q-radio
            v-model="filtro"
            val="nombre"
            label="POR APELLIDO Y NOMBRE"
            color="primary"
            class="q-mt-sm"
          />
        </q-card>
      </div>
    </div>
    <div v-if="mensajeError" class="q-mb-md text-negative text-bold">{{ mensajeError }}</div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="operacion"
      flat
      bordered
      hide-bottom
      class="tabla-comprobantes"
    >
      <template #body-cell-mantenimiento="props">
        <q-td :props="props">
          <q-btn size="sm" color="primary" label="Ver" class="q-mr-sm" />
          <q-btn size="sm" color="positive" label="Apro." class="q-mr-sm" />
          <q-btn size="sm" color="negative" label="Rech." />
        </q-td>
      </template>
    </q-table>
    <div class="row q-mt-md justify-between items-center">
      <div class="text-grey-7 text-caption">Comprobantes de: {{ nombreUsuario || '---' }}</div>
      <div class="text-grey-7 text-caption">D.N.I. {{ dniUsuario || '---' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const busqueda = ref('')
const filtro = ref('dni')
const nombreUsuario = ref('')
const dniUsuario = ref('')
const mensajeError = ref('')
const $q = useQuasar ? useQuasar() : null

const columns = [
  { name: 'operacion', label: 'N° OPERACIÓN', field: 'operacion', align: 'left' },
  { name: 'detalle', label: 'DETALLE', field: 'detalle', align: 'left' },
  { name: 'fecha', label: 'FECHA MOV.', field: 'fecha', align: 'left' },
  { name: 'monto', label: 'MONTO', field: 'monto', align: 'left' },
  { name: 'estado', label: 'ESTADO', field: 'estado', align: 'left' },
  { name: 'mantenimiento', label: 'MANTENIMIENTO', field: 'mantenimiento', align: 'center' },
]

// Definición de las filas de la tabla, inicialmente vacías
const rows = ref([])

// Función asíncrona para buscar usuario y transacción
async function buscar() {
  mensajeError.value = ''
  rows.value = [] // Limpiar la tabla antes de cada búsqueda

  if (filtro.value === 'dni' && busqueda.value) {
    try {
      // --- PASO 1: Buscar usuario por DNI ---
      const userResponse = await fetch(`http://localhost:5283/api/Usuarios/Dni/${busqueda.value}`)

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          mensajeError.value = 'No se encontró el usuario con ese D.N.I.'
        } else {
          mensajeError.value = `Error en la búsqueda de usuario (Código: ${userResponse.status}).`
        }
        nombreUsuario.value = ''
        dniUsuario.value = ''
        try {
          const errorData = await userResponse.json()
          console.error('Error del servidor al buscar usuario:', errorData)
          if (errorData.message) {
            mensajeError.value += ` Detalles: ${errorData.message}`
          }
        } catch (parseError) {
          console.error('No se pudo parsear el error del servidor al buscar usuario:', parseError)
        }
        return
      }

      const userData = await userResponse.json()
      console.log('Respuesta completa del endpoint de usuario:', userData)

      // Manejo de la respuesta si es un array o un objeto único
      const user = Array.isArray(userData) && userData.length > 0 ? userData[0] : userData

      if (user && typeof user === 'object' && user.nombre && user.apellido) {
        nombreUsuario.value = `${user.apellido}, ${user.nombre}`
        dniUsuario.value = user.dni || busqueda.value
        if ($q && $q.notify)
          $q.notify({ type: 'positive', message: 'Usuario encontrado', timeout: 1000 })

        // --- PASO 2: Buscar transacción específica (después de encontrar al usuario) ---
        // ID de transacción hardcodeado según la solicitud
        const transactionId = 26
        const transactionEndpoint = `http://localhost:5283/api/v1/Transactions/${transactionId}`

        try {
          const transactionResponse = await fetch(transactionEndpoint)

          if (!transactionResponse.ok) {
            if (transactionResponse.status === 404) {
              mensajeError.value = `No se encontró la transacción con ID ${transactionId}.`
            } else {
              mensajeError.value = `Error al obtener transacción (Código: ${transactionResponse.status}).`
            }
            rows.value = [] // Asegurarse de que la tabla esté vacía si hay error
            return
          }

          const transactionData = await transactionResponse.json()
          console.log('Respuesta completa del endpoint de transacción:', transactionData)

          // Asumiendo que el endpoint devuelve un solo objeto de transacción con las propiedades esperadas
          if (
            transactionData &&
            typeof transactionData === 'object' &&
            transactionData.idTransaccion &&
            transactionData.concepto &&
            transactionData.fechaRegistro &&
            transactionData.monto &&
            transactionData.estado
          ) {
            rows.value = [
              {
                operacion: transactionData.idTransaccion,
                detalle: transactionData.concepto,
                fecha: transactionData.fechaRegistro,
                monto: transactionData.monto,
                estado: transactionData.estado,
                mantenimiento: '', // Campo para los botones de acción
              },
            ]
            if ($q && $q.notify)
              $q.notify({
                type: 'positive',
                message: `Transacción ${transactionId} cargada`,
                timeout: 1000,
              })
          } else {
            mensajeError.value = 'Formato de datos de transacción inesperado o faltan propiedades.'
            rows.value = []
            if ($q && $q.notify)
              $q.notify({
                type: 'warning',
                message: 'Formato de datos de transacción inesperado',
                timeout: 2000,
              })
          }
        } catch (transactionErr) {
          console.error('Error en fetch de transacción:', transactionErr)
          mensajeError.value = 'Error de red o CORS al obtener la transacción.'
          rows.value = []
        }
      } else {
        nombreUsuario.value = ''
        dniUsuario.value = ''
        mensajeError.value = 'Formato de datos de usuario inesperado: faltan "nombre" o "apellido".'
        if ($q && $q.notify)
          $q.notify({
            type: 'warning',
            message: 'Formato de datos de usuario inesperado',
            timeout: 2000,
          })
      }
    } catch (err) {
      console.error('Error en fetch general:', err)
      mensajeError.value =
        'Error de red o CORS. Revisa la consola del navegador y la configuración del backend.'
      nombreUsuario.value = ''
      dniUsuario.value = ''
      rows.value = []
    }
  } else {
    mensajeError.value = 'Debe ingresar un D.N.I. para buscar.'
    if ($q && $q.notify)
      $q.notify({ type: 'info', message: 'Por favor, ingrese un D.N.I.', timeout: 1000 })
  }
}
</script>

<style scoped>
.validaciones {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 30px; /* Reducido a la mitad */
}
.input-busqueda {
  width: 60%;
  min-width: 250px;
  display: inline-block;
}
.filtro-card {
  min-width: 270px;
}
.tabla-comprobantes {
  margin-top: 16px;
}
</style>
