<template>
  <q-page class="q-pa-xl historial-page-payflow payflow-page-bg">
    <!-- Título -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Historial de Transacciones</div>
      </div>
    </div>

    <!-- Filtros -->
    <TransactionFilters 
      :filters="historyStore.filters"
      :loading="historyStore.loading || historyStore.loadingFondos"
      @apply-filters="onApplyFilters"
      @clear-filters="onClearFilters"
      class="q-mb-lg"
    />

    <!-- Contenido dinámico -->
    <div class="content-section">
      <h2 class="section-title">Movimientos</h2>
      
      <TransactionList 
        :transactions="historyStore.paginatedTransactions"
        :loading="historyStore.loading"
        @view-detail="onViewDetail"
      />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '../store'
import TransactionFilters from '../components/TransactionFilters.vue'
import TransactionList from '../components/TransactionList.vue'

// Router y Store
const router = useRouter()
const historyStore = useHistoryStore()

// Métodos
async function onApplyFilters(filters) {
  console.log('📋 Aplicando filtros:', filters)
  historyStore.filters = { ...filters }
  await historyStore.applyFilters()
}

function onClearFilters() {
  console.log('🧹 Limpiando filtros')
  historyStore.clearFilters()
}

function onViewDetail(transactionId) {
  console.log('👁️ Ver detalle de transacción:', transactionId)
  router.push(`/historial/detalle/${transactionId}`)
}

// Cargar datos al montar el componente
onMounted(async () => {
  console.log('🚀 Iniciando carga de datos del historial...')
  
  try {
    // Cargar fondos y transacciones en paralelo
    await Promise.all([
      historyStore.fetchFondos(),
      historyStore.fetchTransactions()
    ])
    
    console.log('✅ Datos del historial cargados correctamente')
    console.log('📊 Total transacciones:', historyStore.transactions.length)
    console.log('📂 Total fondos:', historyStore.fondos.length)
  } catch (error) {
    console.error('❌ Error al cargar datos del historial:', error)
  }
})
</script>

<style scoped>
.historial-page-payflow {
  background-color: var(--payflow-bg-light);
}

.payflow-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--payflow-primary);
  margin-bottom: 0;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--payflow-text-primary);
  margin-bottom: 1rem;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
