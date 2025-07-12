<template>
  <div class="transaction-list-container">
    <!-- Tabla de transacciones -->
    <div class="table-container">
      <table class="tabla-movimientos-payflow">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Referencia</th>
            <th>Monto</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Fondo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td colspan="8" class="text-center">
              <q-spinner-dots size="md" color="primary" />
              <div class="q-mt-sm">Cargando transacciones...</div>
            </td>
          </tr>
          <tr v-else-if="transactions.length === 0" class="no-data-row">
            <td colspan="8" class="text-center">
              <q-icon name="search_off" size="md" color="grey-5" />
              <div class="q-mt-sm text-grey-6">No se encontraron transacciones</div>
            </td>
          </tr>
          <tr 
            v-else 
            v-for="transaction in transactions" 
            :key="transaction.idTransaccion"
            class="payflow-row-interactive"
          >
            <td :class="getTypeClass(transaction.tipo)">
              <q-icon 
                :name="getTypeIcon(transaction.tipo)" 
                class="q-mr-xs" 
                size="sm"
              />
              {{ transaction.tipo }}
            </td>
            <td>{{ transaction.fechaFormateada || formatDate(transaction.fechaRegistro) }}</td>
            <td class="referencia-cell">{{ transaction.referencia }}</td>
            <td :class="getAmountClass(transaction.tipo)">
              {{ transaction.montoFormateado || formatAmount(transaction.monto, transaction.tipo) }}
            </td>
            <td>{{ transaction.usuario }}</td>
            <td>
              <q-chip 
                :color="getStatusColor(transaction.estado)"
                :text-color="getStatusTextColor(transaction.estado)"
                class="status-chip"
                dense
              >
                {{ transaction.estado }}
              </q-chip>
            </td>
            <td>
              <span class="fondo-text">{{ transaction.nombreFondo || 'Sin asignar' }}</span>
            </td>
            <td>
              <BtnPayflow
                label="Detalle"
                color="primary"
                size="sm"
                flat
                @click="$emit('view-detail', transaction.idTransaccion)"
                class="action-btn"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="pagination-container row justify-between items-center q-mt-md">
      <BtnPayflow 
        label="Anterior" 
        color="primary" 
        :disable="currentPage <= 1"
        @click="$emit('page-change', currentPage - 1)"
        class="pagination-btn"
      />
      <div class="pagination-info text-caption">
        Página {{ currentPage }} de {{ totalPages }}
        <span v-if="totalTransactions > 0" class="q-ml-sm">
          ({{ totalTransactions }} transacciones)
        </span>
      </div>
      <BtnPayflow 
        label="Siguiente" 
        color="primary" 
        :disable="currentPage >= totalPages"
        @click="$emit('page-change', currentPage + 1)"
        class="pagination-btn"
      />
    </div>
  </div>
</template>

<script setup>
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import TransactionService from 'src/services/TransactionService'

// Props
defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalTransactions: {
    type: Number,
    default: 0
  }
})

// Emits
defineEmits(['view-detail', 'page-change'])

// Helper functions
function getTypeClass(tipo) {
  return tipo === 'Retiro' ? 'text-negative' : 'text-primary'
}

function getTypeIcon(tipo) {
  return tipo === 'Retiro' ? 'trending_down' : 'trending_up'
}

function getAmountClass(tipo) {
  return tipo === 'Retiro' ? 'text-negative' : 'text-positive'
}

function getStatusColor(estado) {
  switch (estado) {
    case 'Pendiente': return 'warning'
    case 'Procesado': return 'positive'
    case 'Rechazado': return 'negative'
    default: return 'grey'
  }
}

function getStatusTextColor(estado) {
  switch (estado) {
    case 'Pendiente': return 'dark'
    case 'Procesado': return 'white'
    case 'Rechazado': return 'white'
    default: return 'white'
  }
}

function formatDate(fecha) {
  return TransactionService.formatFecha(fecha)
}

function formatAmount(monto, tipo) {
  return TransactionService.formatMonto(monto, tipo)
}
</script>

<style lang="scss" scoped>
.transaction-list-container {
  width: 100%;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tabla-movimientos-payflow {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  font-size: 14px;
  background: white;
  
  th, td {
    border: 1px solid #d0d0d0;
    padding: 12px 8px;
    text-align: left;
    vertical-align: middle;
  }
  
  th {
    background: #f8f9fa;
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #424242;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  td {
    font-weight: 400;
    height: 48px;
  }
}

.payflow-row-interactive {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }
}

.referencia-cell {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #666;
}

.status-chip {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn {
  min-width: 70px;
}

.loading-row, .no-data-row {
  td {
    padding: 32px 16px;
    color: #666;
  }
}

.pagination-container {
  .pagination-btn {
    min-width: 100px;
  }
  
  .pagination-info {
    color: #666;
    font-weight: 500;
  }
}

.text-negative {
  color: #d32f2f !important;
}

.text-positive {
  color: #43a047 !important;
}

.text-primary {
  color: #0048bd !important;
}

// Responsive design
@media (max-width: 768px) {
  .tabla-movimientos-payflow {
    font-size: 12px;
    
    th, td {
      padding: 8px 4px;
    }
    
    th {
      font-size: 11px;
    }
  }
  
  .status-chip {
    font-size: 10px;
  }
  
  .action-btn {
    min-width: 60px;
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .pagination-container {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    
    .pagination-info {
      order: -1;
    }
  }
}
</style>
