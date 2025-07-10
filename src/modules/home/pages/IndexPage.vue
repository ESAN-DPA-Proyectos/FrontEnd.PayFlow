<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="q-pa-md" style="max-width: 1280px; width: 100%">
      <!-- Bienvenida y resumen -->
      <h6 class="text-h6 q-mb-md">Bienvenido, Juan Pérez</h6>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2">Resumen de Cuenta</div>
          <div>
            Saldo actual: <strong>{{ formatCurrency(balance) }}</strong>
          </div>
        </q-card-section>
      </q-card>

      <!-- Tabla con transacciones -->
      <q-card>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Últimas 10 Transacciones</div>

          <!-- Campo de búsqueda -->
          <q-input
            outlined
            dense
            debounce="300"
            v-model="search"
            placeholder="Buscar en las transacciones..."
            class="q-mb-md"
            clearable
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- Tabla con ordenamiento y filtro -->
          <q-table
            :rows="filteredTransactions"
            :columns="columns"
            row-key="idTransaccion"
            dense
            flat
            bordered
            :loading="loading"
            :filter="search"
            :rows-per-page-options="[10]"
            :pagination="{ rowsPerPage: 10 }"
            wrap-cells
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'

// Simulación del saldo actual
const balance = 1250.0

const allTransactions = ref([])
const loading = ref(true)
const search = ref('')

// Columnas visibles (sin ID, Referencia, Comprobante ni OrigenRol)
const columns = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  {
    name: 'monto',
    label: 'Monto (S/)',
    field: 'monto',
    align: 'right',
    sortable: true,
    format: (val) => `S/ ${val.toFixed(2)}`,
  },
  {
    name: 'fechaRegistro',
    label: 'Fecha',
    field: 'fechaRegistro',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val),
  },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left', sortable: true },
  {
    name: 'metodoPago',
    label: 'Método de Pago',
    field: 'metodoPago',
    align: 'left',
    sortable: true,
  },
  {
    name: 'beneficiarioNombre',
    label: 'Beneficiario',
    field: 'beneficiarioNombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cuentaBeneficiario',
    label: 'Cuenta',
    field: 'cuentaBeneficiario',
    align: 'left',
    sortable: true,
  },
  { name: 'concepto', label: 'Concepto', field: 'concepto', align: 'left', sortable: true },
]

function formatCurrency(valor) {
  return `S/ ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
}

function formatDate(fechaISO) {
  if (!fechaISO) return '-'
  const [date] = fechaISO.split('T')
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

// Solo las 10 más recientes ordenadas por fecha
const filteredTransactions = computed(() => {
  return [...allTransactions.value]
    .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    .slice(0, 10)
})

onMounted(async () => {
  try {
    const response = await api.get('/api/v1/transactions')
    allTransactions.value = response.data
  } catch (error) {
    console.error('Error al obtener transacciones:', error)
  } finally {
    loading.value = false
  }
})
</script>
