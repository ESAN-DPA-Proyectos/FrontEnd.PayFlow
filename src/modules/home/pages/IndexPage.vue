<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="q-pa-md" style="max-width: 1280px; width: 100%">
      <!-- Resumen de cuenta (mitad de ancho, a la izquierda) -->
      <div class="row q-mb-md">
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-subtitle2">Resumen de Cuenta</div>
              <div>
                Saldo actual: <strong>{{ formatCurrency(saldoActual) }}</strong>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Tabla con transacciones -->
      <q-card>
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Últimas 10 Transacciones</div>

          <!-- Campo de búsqueda reducido -->
          <div class="row q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                outlined
                dense
                debounce="300"
                v-model="search"
                placeholder="Buscar en las transacciones..."
                clearable
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- Tabla con ordenamiento -->
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

const allTransactions = ref([])
const loading = ref(true)
const search = ref('')

// Columnas visibles
const columns = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  {
    name: 'monto',
    label: 'Monto (S/)',
    field: 'monto',
    align: 'right',
    sortable: true,
    format: (val) => `S/ ${parseFloat(val).toFixed(2)}`,
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

// Función para formato de moneda
function formatCurrency(valor) {
  return `S/ ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
}

// Función para formato de fecha
function formatDate(fechaISO) {
  if (!fechaISO) return '-'
  const [date] = fechaISO.split('T')
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

// Cálculo del saldo real: solo "procesado", suma depósitos y resta retiros
const saldoActual = computed(() => {
  return allTransactions.value.reduce((acum, t) => {
    const estado = (t.estado || '').toLowerCase()
    const tipo = (t.tipo || '').toLowerCase()
    const monto = parseFloat(t.monto || 0)

    if (estado === 'procesado') {
      if (tipo === 'deposito') return acum + monto
      if (tipo === 'retiro') return acum - monto
    }

    return acum
  }, 0)
})

// Últimas 10 transacciones ordenadas por fecha
const filteredTransactions = computed(() => {
  return [...allTransactions.value]
    .sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro))
    .slice(0, 10)
})

// Obtener transacciones del backend
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
