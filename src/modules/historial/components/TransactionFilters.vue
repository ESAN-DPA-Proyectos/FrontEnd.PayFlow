<template>
  <q-card flat bordered class="payflow-shadow filtros-card-compact full-width">
    <div class="q-pa-md">
      <div class="row items-center full-width q-gutter-sm filtros-grid-payflow">
        <!-- Filtro por Fondo -->
        <q-select
          label="Fondo"
          dense
          v-model="localFilters.fondo"
          :options="fondoOptions"
          clearable
          class="filtro-item filtro-underline"
          style="max-width: 160px; min-width: 120px"
          @update:model-value="onFilterChange"
        />

        <!-- Filtro Fecha Desde -->
        <q-input
          label="Desde"
          dense
          v-model="localFilters.fechaDesde"
          type="date"
          class="filtro-item filtro-underline"
          style="max-width: 140px; min-width: 120px"
          @update:model-value="onFilterChange"
        />

        <!-- Filtro Fecha Hasta -->
        <q-input
          label="Hasta"
          dense
          v-model="localFilters.fechaHasta"
          type="date"
          class="filtro-item filtro-underline"
          style="max-width: 140px; min-width: 120px"
          @update:model-value="onFilterChange"
        />

        <!-- Filtro por Tipo -->
        <q-select
          label="Tipo"
          dense
          v-model="localFilters.tipo"
          :options="tipoOptions"
          clearable
          class="filtro-item filtro-underline"
          style="max-width: 120px; min-width: 100px"
          @update:model-value="onFilterChange"
        />

        <!-- Filtro por Estado -->
        <q-select
          label="Estado"
          dense
          v-model="localFilters.estado"
          :options="estadoOptions"
          clearable
          class="filtro-item filtro-underline"
          style="max-width: 120px; min-width: 100px"
          @update:model-value="onFilterChange"
        />

        <!-- Filtro por Usuario -->
        <q-select
          label="Usuario"
          dense
          v-model="localFilters.usuario"
          :options="usuarioOptions"
          clearable
          use-input
          hide-selected
          fill-input
          input-debounce="300"
          class="filtro-item filtro-underline"
          style="max-width: 140px; min-width: 120px"
          @filter="filterUsuarios"
          @update:model-value="onFilterChange"
        />

        <!-- Botones de acción -->
        <div class="filter-actions" style="min-width: 200px; display: flex; gap: 8px;">
          <BtnPayflow
            label="Aplicar"
            color="primary"
            class="q-flex-grow-1"
            @click="applyFilters"
            :loading="loading"
          />
          <BtnPayflow
            label="Limpiar"
            color="secondary"
            flat
            @click="clearFilters"
            :disable="!hasActiveFilters"
          />
        </div>
      </div>

      <!-- Indicador de filtros activos -->
      <div v-if="hasActiveFilters" class="active-filters-indicator q-mt-sm">
        <div class="text-caption text-primary">
          <q-icon name="filter_list" size="sm" />
          Filtros activos:
          <q-chip
            v-for="(value, key) in activeFiltersDisplay"
            :key="key"
            :label="`${getFilterLabel(key)}: ${value}`"
            removable
            color="primary"
            text-color="white"
            size="sm"
            @remove="removeFilter(key)"
            class="q-ml-xs"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import { useHistoryStore } from '../store'

// Store
const historyStore = useHistoryStore()

// Props
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['apply-filters', 'clear-filters'])

// Local reactive state
const localFilters = ref({
  fondo: props.filters.fondo || '',
  tipo: props.filters.tipo || '',
  estado: props.filters.estado || '',
  usuario: props.filters.usuario || '',
  fechaDesde: props.filters.fechaDesde || '',
  fechaHasta: props.filters.fechaHasta || ''
})

// Computed para obtener fondos del store
const fondoOptions = computed(() => historyStore.fondos)

// Cargar fondos al montar el componente
onMounted(async () => {
  if (historyStore.fondos.length === 0) {
    await historyStore.fetchFondos()
  }
})

// Options for filters
const tipoOptions = ref([
  'Deposito',
  'Retiro'
])

const estadoOptions = ref([
  'Pendiente',
  'Procesado',
  'Rechazado'
])

const usuarioOptions = ref([
  'gestor.actividad',
  'luis.garcia',
  'pedro.ruiz',
  'rosa.aguilar',
  'admin.fondos',
  'maria.lopez',
  'carlos.rodriguez'
])

const filteredUsuarioOptions = ref([...usuarioOptions.value])

// Computed properties
const hasActiveFilters = computed(() => {
  return Object.values(localFilters.value).some(value => value && value.trim() !== '')
})

const activeFiltersDisplay = computed(() => {
  const active = {}
  Object.entries(localFilters.value).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      active[key] = value
    }
  })
  return active
})

// Watch for prop changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = {
    fondo: newFilters.fondo || '',
    tipo: newFilters.tipo || '',
    estado: newFilters.estado || '',
    usuario: newFilters.usuario || '',
    fechaDesde: newFilters.fechaDesde || '',
    fechaHasta: newFilters.fechaHasta || ''
  }
}, { deep: true })

// Methods
function onFilterChange() {
  // Auto-apply filters on change (optional)
  // emit('apply-filters', { ...localFilters.value })
}

function applyFilters() {
  emit('apply-filters', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {
    fondo: '',
    tipo: '',
    estado: '',
    usuario: '',
    fechaDesde: '',
    fechaHasta: ''
  }
  emit('clear-filters')
}

function removeFilter(filterKey) {
  localFilters.value[filterKey] = ''
  emit('apply-filters', { ...localFilters.value })
}

function getFilterLabel(key) {
  const labels = {
    fondo: 'Fondo',
    tipo: 'Tipo',
    estado: 'Estado',
    usuario: 'Usuario',
    fechaDesde: 'Desde',
    fechaHasta: 'Hasta'
  }
  return labels[key] || key
}

function filterUsuarios(val, update) {
  if (val === '') {
    update(() => {
      filteredUsuarioOptions.value = usuarioOptions.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filteredUsuarioOptions.value = usuarioOptions.value.filter(
      v => v.toLowerCase().indexOf(needle) > -1
    )
  })
}
</script>

<style lang="scss" scoped>
.filtros-card-compact {
  border-radius: 12px;
  background: #fff;
  width: fit-content;
  min-width: 240px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  overflow: hidden;
}

.filtros-grid-payflow {
  width: 100%;
  flex-wrap: wrap;
  gap: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.filtro-item {
  flex: 1 1 0;
  min-width: 120px;
  max-width: 180px;
  border: none;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  box-sizing: border-box;
}

.filter-actions {
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.active-filters-indicator {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  margin-top: 12px;
}

// Estilos para los campos con underline
.filtro-underline :deep(.q-field__control:after),
.filtro-underline :deep(.q-field__control:before) {
  border-bottom: 2px solid #757575 !important;
  border-radius: 0;
}

.filtro-underline :deep(.q-field__control) {
  min-height: 44px;
  align-items: flex-end;
}

.filtro-underline :deep(.q-field__label) {
  top: 12px !important;
  font-size: 15px;
}

.filtro-underline :deep(.q-field__native) {
  color: #212121 !important;
  margin-top: 3px !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 32px !important;
  line-height: 32px !important;
  display: flex;
  align-items: center;
}

.filtro-underline :deep(.q-field__append) {
  align-items: center !important;
  display: flex;
  height: 32px !important;
}

.filtro-underline :deep(.q-icon) {
  font-size: 22px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  display: flex;
  align-items: center;
}

// Responsive design
@media (max-width: 1100px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 220px;
    max-width: 95vw;
    padding: 12px 4vw !important;
    margin-left: auto;
    margin-right: auto;
  }

  .filtros-grid-payflow {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    width: 100%;
    min-width: 0;
    max-width: 100vw;
    justify-content: center;
  }

  .filtro-item {
    max-width: 100%;
    min-width: 0;
    flex: 1 1 100%;
  }

  .filter-actions {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 600px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 180px;
    max-width: 98vw;
    padding: 8px 2vw !important;
  }

  .filter-actions {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}
</style>
