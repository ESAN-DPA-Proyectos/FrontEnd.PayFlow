<template>
  <q-page class="q-pa-xl admin-fondos-page payflow-page-bg">
    <!-- Título -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Administración de Fondos</div>
        <p class="text-body2 text-grey-6 q-mt-sm">
          Gestiona los fondos específicos para organizar las transacciones del sistema
        </p>
      </div>
    </div>

    <!-- Botón para crear nuevo fondo -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <BtnPayflow 
          label="➕ Crear Nuevo Fondo" 
          color="primary" 
          @click="abrirDialogoCrear"
          icon="add"
        />
      </div>
    </div>

    <!-- Lista de fondos -->
    <div class="row">
      <div class="col-12">
        <q-card flat bordered class="payflow-shadow">
          <q-card-section>
            <div class="text-h6 q-mb-md">Fondos Registrados</div>
            
            <!-- Loading -->
            <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner-dots size="lg" color="primary" />
              <div class="q-mt-sm">Cargando fondos...</div>
            </div>
            
            <!-- Lista de fondos -->
            <div v-else-if="fondos.length > 0" class="fondos-lista">
              <q-list separator>
                <q-item 
                  v-for="fondo in fondos" 
                  :key="fondo.id" 
                  class="fondo-item"
                >
                  <q-item-section>
                    <q-item-label class="text-h6">{{ fondo.nombre }}</q-item-label>
                    <q-item-label caption lines="2">{{ fondo.descripcion }}</q-item-label>
                    <q-item-label caption class="text-grey-5">
                      ID: {{ fondo.id }} | 
                      Estado: {{ fondo.activo ? 'Activo' : 'Inactivo' }}
                    </q-item-label>
                  </q-item-section>
                  
                  <q-item-section side>
                    <div class="row q-gutter-sm">
                      <BtnPayflow 
                        icon="edit" 
                        color="info" 
                        size="sm" 
                        flat 
                        round
                        @click="editarFondo(fondo)"
                        :title="`Editar ${fondo.nombre}`"
                      />
                      <BtnPayflow 
                        icon="delete" 
                        color="negative" 
                        size="sm" 
                        flat 
                        round
                        @click="confirmarEliminar(fondo)"
                        :title="`Eliminar ${fondo.nombre}`"
                      />
                      <q-toggle 
                        v-model="fondo.activo" 
                        @update:model-value="toggleEstado(fondo)"
                        :label="fondo.activo ? 'Activo' : 'Inactivo'"
                        color="primary"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            
            <!-- Sin fondos -->
            <div v-else class="text-center q-pa-xl">
              <q-icon name="folder_off" size="3rem" color="grey-5" />
              <div class="q-mt-md text-h6 text-grey-6">No hay fondos registrados</div>
              <div class="q-mt-xs text-body2 text-grey-5">
                Crea el primer fondo para comenzar a organizar las transacciones
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo para crear/editar fondo -->
    <q-dialog v-model="mostrarDialogo" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ fondoEditando ? 'Editar Fondo' : 'Crear Nuevo Fondo' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="guardarFondo" class="q-gutter-md">
            <q-input
              v-model="formularioFondo.nombre"
              label="Nombre del Fondo *"
              hint="Ej: Viaje de promoción a Cusco"
              :rules="[val => !!val || 'El nombre es obligatorio']"
              maxlength="100"
              counter
            />
            
            <q-input
              v-model="formularioFondo.descripcion"
              label="Descripción"
              hint="Descripción detallada del propósito del fondo"
              type="textarea"
              rows="3"
              maxlength="500"
              counter
            />
            
            <q-toggle
              v-model="formularioFondo.activo"
              label="Fondo activo"
              hint="Los fondos inactivos no aparecerán en los filtros"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <BtnPayflow 
            label="Cancelar" 
            color="grey" 
            flat 
            v-close-popup 
          />
          <BtnPayflow 
            :label="fondoEditando ? 'Actualizar' : 'Crear'" 
            color="primary" 
            @click="guardarFondo"
            :loading="guardando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="mostrarConfirmacion" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">
            ¿Estás seguro de que quieres eliminar el fondo 
            <strong>"{{ fondoAEliminar?.nombre }}"</strong>?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <BtnPayflow 
            label="Cancelar" 
            color="grey" 
            flat 
            v-close-popup 
          />
          <BtnPayflow 
            label="Eliminar" 
            color="negative" 
            @click="eliminarFondo"
            :loading="eliminando"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import FondoService from 'src/services/FondoService'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Estado reactivo
const fondos = ref([])
const loading = ref(false)
const mostrarDialogo = ref(false)
const mostrarConfirmacion = ref(false)
const guardando = ref(false)
const eliminando = ref(false)

// Formulario
const fondoEditando = ref(null)
const fondoAEliminar = ref(null)
const formularioFondo = ref({
  nombre: '',
  descripcion: '',
  activo: true
})

// Cargar fondos al montar el componente
onMounted(() => {
  cargarFondos()
})

async function cargarFondos() {
  loading.value = true
  try {
    console.log('📂 Cargando fondos desde BD...')
    fondos.value = await FondoService.getAllFondos()
    console.log('✅ Fondos cargados:', fondos.value.length)
  } catch (error) {
    console.error('❌ Error al cargar fondos:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar fondos',
      caption: error.message
    })
  } finally {
    loading.value = false
  }
}

function abrirDialogoCrear() {
  fondoEditando.value = null
  formularioFondo.value = {
    nombre: '',
    descripcion: '',
    activo: true
  }
  mostrarDialogo.value = true
}

function editarFondo(fondo) {
  fondoEditando.value = fondo
  formularioFondo.value = {
    nombre: fondo.nombre,
    descripcion: fondo.descripcion || '',
    activo: fondo.activo
  }
  mostrarDialogo.value = true
}

async function guardarFondo() {
  // Validar datos
  const validacion = FondoService.validarDatosFondo(formularioFondo.value)
  if (!validacion.valido) {
    $q.notify({
      type: 'negative',
      message: 'Datos inválidos',
      caption: validacion.errores.join(', ')
    })
    return
  }

  guardando.value = true
  try {
    if (fondoEditando.value) {
      // Actualizar fondo existente
      await FondoService.updateFondo(fondoEditando.value.id, formularioFondo.value)
      $q.notify({
        type: 'positive',
        message: 'Fondo actualizado exitosamente',
        icon: 'check'
      })
    } else {
      // Crear nuevo fondo
      await FondoService.createFondo(formularioFondo.value)
      $q.notify({
        type: 'positive',
        message: 'Fondo creado exitosamente',
        icon: 'check'
      })
    }
    
    mostrarDialogo.value = false
    await cargarFondos() // Recargar lista
  } catch (error) {
    console.error('❌ Error al guardar fondo:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al guardar fondo',
      caption: error.message
    })
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(fondo) {
  fondoAEliminar.value = fondo
  mostrarConfirmacion.value = true
}

async function eliminarFondo() {
  if (!fondoAEliminar.value) return

  eliminando.value = true
  try {
    await FondoService.deleteFondo(fondoAEliminar.value.id)
    $q.notify({
      type: 'positive',
      message: 'Fondo eliminado exitosamente',
      icon: 'check'
    })
    
    mostrarConfirmacion.value = false
    fondoAEliminar.value = null
    await cargarFondos() // Recargar lista
  } catch (error) {
    console.error('❌ Error al eliminar fondo:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar fondo',
      caption: error.message
    })
  } finally {
    eliminando.value = false
  }
}

async function toggleEstado(fondo) {
  try {
    await FondoService.updateFondo(fondo.id, { 
      ...fondo, 
      activo: fondo.activo 
    })
    
    $q.notify({
      type: 'positive',
      message: `Fondo ${fondo.activo ? 'activado' : 'desactivado'}`,
      icon: fondo.activo ? 'visibility' : 'visibility_off'
    })
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error)
    // Revertir el cambio en la UI
    fondo.activo = !fondo.activo
    
    $q.notify({
      type: 'negative',
      message: 'Error al cambiar estado del fondo',
      caption: error.message
    })
  }
}
</script>

<style lang="scss" scoped>
.admin-fondos-page {
  .fondo-item {
    border-radius: 8px;
    margin-bottom: 8px;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  .fondos-lista {
    .q-item {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
    }
  }
}

// Responsive para dispositivos móviles
@media (max-width: 768px) {
  .admin-fondos-page {
    .q-pa-xl {
      padding: 16px;
    }
    
    .fondo-item {
      .q-item-section.side {
        flex-direction: column;
        align-items: flex-end;
        
        .row {
          flex-direction: column;
          gap: 8px;
        }
      }
    }
  }
}
</style>
