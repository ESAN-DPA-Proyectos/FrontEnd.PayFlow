<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Panel de filtros -->
      <div class="col-12 col-md-4">
        <h6 class="text-primary">Generar Reportes</h6>

        <!-- Toggle: seleccionar todos -->
        <q-toggle
          v-model="seleccionarTodos"
          label="Seleccionar todos los campos"
          color="primary"
          class="q-mb-sm"
        />

        <!-- Lista de campos -->
        <q-option-group
          v-model="selectedFields"
          :options="fieldOptions"
          type="checkbox"
          inline
          label="Seleccionar columnas"
          dense
          @update:model-value="onFieldsChange"
        />

        <!-- Filtros adicionales -->
        <q-input
          v-model="codigoCliente"
          label="Código de Cliente (opcional)"
          outlined
          dense
          clearable
          class="q-mt-md"
        />

        <div class="row q-col-gutter-sm q-mt-md">
          <div class="col">
            <q-input v-model="fechaInicio" type="date" label="Desde" dense outlined />
          </div>
          <div class="col">
            <q-input v-model="fechaFin" type="date" label="Hasta" dense outlined />
          </div>
        </div>

        <!-- Generar -->
        <q-btn
          label="Generar reporte"
          color="primary"
          class="q-mt-md full-width"
          :disable="selectedFields.length === 0 || cargando"
          @click="generarVistaPrevia"
        />
      </div>

      <!-- Vista previa -->
      <div class="col-12 col-md-8">
        <q-inner-loading :showing="cargando" color="primary" />

        <template v-if="vistaPrevia.length">
          <div class="text-subtitle2 q-mb-sm">VISTA PREVIA</div>

          <q-table
            :rows="vistaPrevia"
            :columns="previewColumns"
            row-key="idTransaccion"
            dense
            flat
            bordered
            :pagination="{ rowsPerPage: 5 }"
          />

          <div class="q-mt-md row q-gutter-sm">
            <q-btn
              label="Exportar a Excel"
              icon="description"
              color="green"
              @click="exportarExcel"
            />
            <q-btn label="Exportar a PDF" icon="picture_as_pdf" color="red" @click="exportarPDF" />
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { QOptionGroup, QBtn, QInput, QTable, QPage, QInnerLoading, QToggle } from 'quasar'
import { ref, computed, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { api } from 'boot/axios'

/* ---------- Definición de campos de Transacciones ---------- */
const fields = [
  { label: 'ID Transacción', value: 'idTransaccion' },
  { label: 'Tipo', value: 'tipo' },
  { label: 'Monto', value: 'monto' },
  { label: 'Fecha', value: 'fechaRegistro' },
  { label: 'Estado', value: 'estado' },
  { label: 'Método de Pago', value: 'metodoPago' },
  { label: 'Beneficiario', value: 'beneficiarioNombre' },
  { label: 'Cuenta', value: 'cuentaBeneficiario' },
  { label: 'Concepto', value: 'concepto' },
  { label: 'Referencia', value: 'referencia' },
  { label: 'Id Usuario', value: 'idUsuario' },
  { label: 'Id Fondo', value: 'idFondo' },
  { label: 'Origen Rol', value: 'origenRol' },
]

/* ---------- Estado reactivo ---------- */
const selectedFields = ref([])
const seleccionarTodos = ref(false)
const codigoCliente = ref('')
const fechaInicio = ref('')
const fechaFin = ref('')
const todasTransacciones = ref([])
const vistaPrevia = ref([])
const cargando = ref(false)

/* ---------- Opciones para q-option-group ---------- */
const fieldOptions = fields.map((f) => ({ label: f.label, value: f.value }))

/* ---------- Sincronizar toggle con campos ---------- */
watch(seleccionarTodos, (val) => {
  selectedFields.value = val ? fields.map((f) => f.value) : []
})

function onFieldsChange(val) {
  seleccionarTodos.value = val.length === fields.length
}

/* ---------- Obtener datos del backend ---------- */
onMounted(async () => {
  try {
    cargando.value = true
    const { data } = await api.get('/api/v1/transactions')
    todasTransacciones.value = data
  } catch (err) {
    console.error('Error al cargar transacciones:', err)
  } finally {
    cargando.value = false
  }
})

/* ---------- Columnas para la tabla ---------- */
const previewColumns = computed(() =>
  selectedFields.value.map((key) => {
    const meta = fields.find((f) => f.value === key)
    return {
      name: key,
      label: meta?.label || key,
      field: key,
      align: 'left',
      sortable: true,
    }
  }),
)

/* ---------- Generar vista previa ---------- */
function generarVistaPrevia() {
  const desde = fechaInicio.value ? new Date(fechaInicio.value) : null
  const hasta = fechaFin.value ? new Date(fechaFin.value) : null

  vistaPrevia.value = todasTransacciones.value
    .filter((t) => {
      if (codigoCliente.value && String(t.idUsuario) !== codigoCliente.value) return false
      const fecha = new Date(t.fechaRegistro)
      if (desde && fecha < desde) return false
      if (hasta && fecha > hasta) return false
      return true
    })
    .map((t) => {
      const obj = {}
      selectedFields.value.forEach((key) => {
        obj[key] = t[key]
      })
      return obj
    })
}

/* ---------- Exportar a Excel ---------- */
function exportarExcel() {
  const worksheet = XLSX.utils.json_to_sheet(vistaPrevia.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte')
  XLSX.writeFile(workbook, 'reporte_transacciones.xlsx')
}

/* ---------- Exportar a PDF ---------- */
function exportarPDF() {
  const doc = new jsPDF()
  const head = [selectedFields.value.map((k) => fields.find((f) => f.value === k)?.label || k)]
  const body = vistaPrevia.value.map((row) => selectedFields.value.map((k) => row[k]))
  autoTable(doc, { head, body })
  doc.save('reporte_transacciones.pdf')
}
</script>
