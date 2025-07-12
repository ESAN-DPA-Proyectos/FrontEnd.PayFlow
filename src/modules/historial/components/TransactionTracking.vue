<template>
  <div class="transaction-tracking">
    <div class="tracking-header">
      <h6 class="text-subtitle1 text-weight-bold q-mb-md">
        <q-icon name="timeline" class="q-mr-sm" />
        Seguimiento de la transacción
      </h6>
    </div>

    <div class="timeline-container">
      <div 
        v-for="(step, index) in trackingSteps" 
        :key="index"
        class="timeline-item"
        :class="getStepClass(step)"
      >
        <!-- Timeline dot -->
        <div class="timeline-dot" :class="getDotClass(step)">
          <q-icon 
            v-if="step.estado === 'Completado'" 
            name="check" 
            size="sm"
            color="white"
          />
          <q-icon 
            v-else-if="step.estado === 'En Proceso'" 
            name="hourglass_empty" 
            size="sm"
            color="white"
          />
        </div>

        <!-- Timeline content -->
        <div class="timeline-content">
          <div class="timeline-date" v-if="step.fechaHora">
            {{ formatDateTime(step.fechaHora) }}
          </div>
          <div class="timeline-label" v-else>
            {{ step.estado }}
          </div>
          <div class="timeline-title text-weight-bold">
            {{ step.hito }}
          </div>
          <div v-if="step.descripcion" class="timeline-description text-caption">
            {{ step.descripcion }}
          </div>
        </div>

        <!-- Timeline line -->
        <div 
          v-if="index < trackingSteps.length - 1" 
          class="timeline-line"
          :class="getLineClass(step, trackingSteps[index + 1])"
        ></div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="tracking-loading text-center q-pa-md">
      <q-spinner-dots size="md" color="primary" />
      <div class="q-mt-sm text-caption">Cargando seguimiento...</div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && trackingSteps.length === 0" class="tracking-empty text-center q-pa-md">
      <q-icon name="timeline" size="lg" color="grey-5" />
      <div class="q-mt-sm text-grey-6">No hay información de seguimiento disponible</div>
    </div>

    <!-- Refresh button -->
    <div class="tracking-actions text-center q-mt-md">
      <BtnPayflow
        label="Actualizar seguimiento"
        color="primary"
        flat
        size="sm"
        icon="refresh"
        @click="$emit('refresh')"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'

// Props
defineProps({
  trackingSteps: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits(['refresh'])

// Methods
function getStepClass(step) {
  return {
    'active': step.estado === 'Completado',
    'current': step.estado === 'En Proceso',
    'pending': step.estado === 'Pendiente'
  }
}

function getDotClass(step) {
  return {
    'completed': step.estado === 'Completado',
    'current': step.estado === 'En Proceso',
    'pending': step.estado === 'Pendiente'
  }
}

function getLineClass(currentStep) {
  return {
    'completed': currentStep.estado === 'Completado',
    'partial': currentStep.estado === 'En Proceso',
    'pending': currentStep.estado === 'Pendiente'
  }
}

function formatDateTime(dateTime) {
  if (!dateTime) return ''
  
  const date = new Date(dateTime)
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<style lang="scss" scoped>
.transaction-tracking {
  width: 100%;
}

.tracking-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.timeline-container {
  position: relative;
  padding-left: 8px;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  min-height: 60px;
  
  &:last-child {
    min-height: auto;
  }
}

.timeline-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
  position: relative;
  z-index: 2;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  &.completed {
    background-color: #43a047;
  }
  
  &.current {
    background-color: #f9a825;
    animation: pulse 2s infinite;
  }
  
  &.pending {
    background-color: #e0e0e0;
  }
}

.timeline-content {
  flex: 1;
  padding-bottom: 24px;
}

.timeline-date {
  font-size: 12px;
  color: #43a047;
  font-weight: 600;
  margin-bottom: 4px;
}

.timeline-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
}

.timeline-description {
  color: #666;
  line-height: 1.3;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 32px;
  bottom: -24px;
  width: 2px;
  z-index: 1;
  
  &.completed {
    background-color: #43a047;
  }
  
  &.partial {
    background: linear-gradient(to bottom, #43a047 50%, #e0e0e0 50%);
  }
  
  &.pending {
    background-color: #e0e0e0;
  }
}

.tracking-loading,
.tracking-empty {
  color: #666;
}

.tracking-actions {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 16px;
}

// Animation
@keyframes pulse {
  0% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(249, 168, 37, 0.4);
  }
  70% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(249, 168, 37, 0);
  }
  100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(249, 168, 37, 0);
  }
}

// Responsive design
@media (max-width: 600px) {
  .timeline-dot {
    width: 28px;
    height: 28px;
    margin-right: 12px;
  }
  
  .timeline-line {
    left: 13px;
    top: 28px;
  }
  
  .timeline-title {
    font-size: 13px;
  }
  
  .timeline-date,
  .timeline-label {
    font-size: 11px;
  }
}
</style>
