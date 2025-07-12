<template>
  <q-page class="q-pa-xl historial-page-payflow payflow-page-bg">
    <!-- Título fuera del card para mantener coherencia -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Historial de Transacciones</div>
      </div>
    </div>

    <div class="row items-start q-col-gutter-md q-mb-lg filtros-row-payflow">
      <!-- Card de filtros sin título integrado -->
      <q-card flat bordered class="payflow-shadow filtros-card-compact full-width">
        <!-- Sección de filtros -->
        <div class="q-pa-md">
          <div class="row items-center full-width q-gutter-sm filtros-grid-payflow">
            <q-select
              label="Fondo"
              dense
              v-model="fondoSeleccionado"
              :options="fondos"
              clearable
              class="filtro-item filtro-underline"
              style="max-width: 180px; min-width: 120px"
            />
            <q-input
              label="Desde"
              dense
              v-model="fechaDesde"
              type="date"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-input
              label="Hasta"
              dense
              v-model="fechaHasta"
              type="date"
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-select
              label="Por Tipo"
              dense
              v-model="tipoSeleccionado"
              :options="tipos"
              clearable
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-select
              label="Por Estado"
              dense
              v-model="estadoSeleccionado"
              :options="estados"
              clearable
              class="filtro-item filtro-underline"
              style="max-width: 120px; min-width: 100px"
            />
            <q-select
              label="Por Usuario"
              dense
              v-model="usuarioSeleccionado"
              :options="usuarios"
              clearable
              class="filtro-item filtro-underline"
              style="max-width: 140px; min-width: 100px"
            />
            <BtnPayflow
              label="Aplicar Filtros"
              color="primary"
              class="filtro-item q-ml-sm"
              style="min-width: 140px"
              @click="aplicarFiltros"
            />
          </div>
        </div>
      </q-card>
    </div>
    <div class="row items-start q-col-gutter-xl">
      <!-- Tabla -->
      <div class="col movimientos-col-payflow">
        <q-card flat bordered class="payflow-shadow q-pa-md movimientos-card">
          <div class="text-subtitle1 text-center q-mb-md">Movimientos</div>
          <div style="overflow-x: auto">
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
                <!-- Indicador de carga -->
                <tr v-if="loading">
                  <td colspan="8" class="text-center q-pa-md">
                    <q-spinner-dots size="lg" color="primary" />
                    <div class="q-mt-sm">Cargando transacciones desde la base de datos...</div>
                  </td>
                </tr>
                
                <!-- Mensaje cuando no hay datos -->
                <tr v-else-if="!loading && rows.length === 0">
                  <td colspan="8" class="text-center q-pa-xl">
                    <q-icon name="info" size="3rem" color="grey-5" />
                    <div class="q-mt-md text-h6 text-grey-6">No hay transacciones para mostrar</div>
                    <div class="q-mt-xs text-body2 text-grey-5">
                      No se encontraron transacciones en la base de datos
                    </div>
                    <div class="q-mt-md">
                      <BtnPayflow
                        label="🔍 Probar Conexión BD"
                        color="info"
                        size="sm"
                        @click="probarConexionBD"
                        :loading="probandoConexion"
                        class="q-mr-sm"
                      />
                      <BtnPayflow
                        label="🧪 Cargar Datos Test"
                        color="warning"
                        size="sm"
                        @click="cargarDatosTemporales"
                        flat
                      />
                    </div>
                    <div v-if="estadoConexion" class="q-mt-sm text-caption">
                      {{ estadoConexion }}
                    </div>
                  </td>
                </tr>
                
                <!-- Filas de datos -->
                <tr v-else v-for="(row, i) in rows" :key="row.id || i" class="payflow-row-interactive">
                  <td :class="row.tipo === 'Retiro' ? 'text-negative' : 'text-primary'">
                    {{ row.tipo }}
                  </td>
                  <td>{{ row.fecha }}</td>
                  <td>{{ row.referencia }}</td>
                  <td :class="row.tipo === 'Retiro' ? 'text-negative' : 'text-positive'">
                    S/ {{ row.tipo === 'Retiro' ? '-' : '' }}{{ row.monto }}
                  </td>
                  <td>{{ row.usuario }}</td>
                  <td>
                    <span :class="row.estado === 'Pendiente' ? 'text-warning' : 'text-positive'">{{
                      row.estado
                    }}</span>
                  </td>
                  <td class="text-caption">
                    <span class="text-primary">{{ row.fondo || 'Sin asignar' }}</span>
                  </td>
                  <td>
                    <BtnPayflow
                      label="Detalle"
                      color="primary"
                      size="sm"
                      flat
                      @click="verDetalle(row.referencia)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row justify-between items-center q-mt-md">
            <BtnPayflow label="Anterior" color="primary" :disable="true" />
            <div class="text-caption">
              {{ rows.length }} transacciones encontradas
            </div>
            <BtnPayflow label="Siguiente" color="primary" :disable="true" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import BtnPayflow from 'src/components/atomos/BtnPayflow.vue'
import TransactionService from 'src/services/TransactionService'
import FondoService from 'src/services/FondoService'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado reactivo solo para datos de BD
const rows = ref([])
const loading = ref(false)

// Estados para diagnóstico de conexión
const probandoConexion = ref(false)
const estadoConexion = ref('')

// Filtros
const fondoSeleccionado = ref('')
const tipoSeleccionado = ref('')
const estadoSeleccionado = ref('')
const usuarioSeleccionado = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

// Opciones para los filtros
const fondos = ref([])
const tipos = ref(['Deposito', 'Retiro'])
const estados = ref(['Pendiente', 'Completado', 'Cancelado'])
const usuarios = ref(['Gestor de Actividad', 'Administrador', 'Usuario'])

// Cargar datos iniciales
onMounted(async () => {
  console.log('🚀 Iniciando carga de componentes...')
  await Promise.all([
    cargarFondos(),
    cargarTransaccionesDesdeDB()
  ])
  console.log('✅ Componentes cargados')
  console.log('📂 Total fondos disponibles:', fondos.value?.length || 0)
})

async function cargarFondos() {
  try {
    console.log('📂 Cargando fondos desde BD...')
    const fondosData = await FondoService.getAllFondos()
    console.log('📂 Datos de fondos recibidos:', fondosData)
    console.log('📂 Tipo de fondosData:', typeof fondosData)
    console.log('📂 Es array fondosData:', Array.isArray(fondosData))
    
    // Asegurar que fondosData es un array
    const fondosArray = Array.isArray(fondosData) ? fondosData : []
    
    fondos.value = FondoService.formatFondosForSelect(fondosArray)
    console.log('✅ Fondos formateados para select:', fondos.value)
    console.log('✅ Total fondos cargados:', fondos.value.length)
  } catch (error) {
    console.error('❌ Error al cargar fondos:', error)
    // Usar fondos por defecto en caso de error
    const fondosDefecto = FondoService.getFondosDefecto()
    console.log('⚠️ Usando fondos por defecto:', fondosDefecto)
    fondos.value = FondoService.formatFondosForSelect(fondosDefecto)
    console.log('✅ Fondos por defecto formateados:', fondos.value)
  }
}

async function cargarTransaccionesDesdeDB() {
  loading.value = true
  try {
    console.log('🔄 Cargando transacciones y fondos desde la base de datos...')
    
    // Cargar transacciones y fondos en paralelo
    const [transacciones, fondosData] = await    Promise.all([
      TransactionService.getAllTransactions(),
      FondoService.getAllFondos()
    ])
    
    console.log('📊 Transacciones obtenidas:', transacciones.length)
    console.log('📂 Fondos obtenidos:', fondosData)
    console.log('📂 Tipo de fondosData:', typeof fondosData)
    console.log('📂 Es array:', Array.isArray(fondosData))
    
    if (transacciones && transacciones.length > 0) {
      // Validar que fondosData es un array
      const fondosArray = Array.isArray(fondosData) ? fondosData : []
      
      // Mapear nombres de fondos
      const mapFondos = {}
      fondosArray.forEach(f => {
        mapFondos[f.idFondo] = f.nombre
      })
      
      // Agregar fondos por defecto si no hay datos
      if (fondosArray.length === 0) {
        mapFondos[2] = 'Viaje de promoción a Cusco'
        mapFondos[4] = 'Fondo General'
      }
      
      console.log('📂 Mapa de fondos:', mapFondos)
      
      // Transformar transacciones con nombres de fondos
      rows.value = transacciones
        .map(t => {
          // Determinar fondo según fecha (regla de negocio)
          const fechaTransaccion = new Date(t.fechaRegistro || '2025-07-12')
          const esDeEstesMes = fechaTransaccion.getMonth() === 6 && fechaTransaccion.getFullYear() === 2025
          
          let idFondoAsignado
          let nombreFondo
          
          if (esDeEstesMes) {
            idFondoAsignado = 2 // Viaje de promoción a Cusco
            nombreFondo = mapFondos[2] || 'Viaje de promoción a Cusco'
          } else {
            idFondoAsignado = 4 // Fondo General  
            nombreFondo = mapFondos[4] || 'Fondo General'
          }
          
          return {
            tipo: t.tipo || 'N/A',
            fecha: t.fechaRegistro ? TransactionService.formatFecha(t.fechaRegistro) : 'Sin fecha',
            referencia: t.referencia || `TXN-${t.idTransaccion}`,
            monto: (t.monto || 0).toString(),
            usuario: t.origenRol || 'N/A',
            estado: t.estado || 'N/A',
            fondo: nombreFondo,
            id: t.idTransaccion,
            fechaRegistro: t.fechaRegistro,
            idFondo: idFondoAsignado
          }
        })
        .sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0))
      
      console.log(`✅ ${transacciones.length} transacciones con fondos procesadas`)
      estadoConexion.value = `✅ ${rows.value.length} transacciones con fondos cargadas`
    } else {
      console.log('⚠️  No hay transacciones en la base de datos')
      rows.value = []
      estadoConexion.value = '⚠️  No hay transacciones en la BD'
    }
  } catch (error) {
    console.error('❌ Error al cargar desde BD:', error)
    rows.value = []
    estadoConexion.value = `❌ Error: ${error.message}`
  } finally {
    loading.value = false
  }
}

async function aplicarFiltros() {
  loading.value = true
  try {
    console.log('🔍 Aplicando filtros...')
    
    // Obtener todas las transacciones primero
    const todasLasTransacciones = await TransactionService.getAllTransactionsWithFondo()
    
    // Aplicar filtros localmente
    let transaccionesFiltradas = todasLasTransacciones
    
    if (fondoSeleccionado.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        t.idFondo === fondoSeleccionado.value
      )
      console.log(`📂 Filtro por fondo ID: ${fondoSeleccionado.value}`)
    }
    
    if (tipoSeleccionado.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        t.tipo === tipoSeleccionado.value
      )
      console.log(`📋 Filtro por tipo: ${tipoSeleccionado.value}`)
    }
    
    if (estadoSeleccionado.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        t.estado === estadoSeleccionado.value
      )
      console.log(`⚡ Filtro por estado: ${estadoSeleccionado.value}`)
    }
    
    if (usuarioSeleccionado.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        t.origenRol === usuarioSeleccionado.value
      )
      console.log(`👤 Filtro por usuario: ${usuarioSeleccionado.value}`)
    }
    
    if (fechaDesde.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        new Date(t.fechaRegistro) >= new Date(fechaDesde.value)
      )
      console.log(`📅 Filtro desde: ${fechaDesde.value}`)
    }
    
    if (fechaHasta.value) {
      transaccionesFiltradas = transaccionesFiltradas.filter(t => 
        new Date(t.fechaRegistro) <= new Date(fechaHasta.value)
      )
      console.log(`📅 Filtro hasta: ${fechaHasta.value}`)
    }
    
    // Transformar resultados
    rows.value = transaccionesFiltradas
      .map(t => ({
        tipo: t.tipo || 'N/A',
        fecha: t.fechaRegistro ? TransactionService.formatFecha(t.fechaRegistro) : 'Sin fecha',
        referencia: t.referencia || `TXN-${t.idTransaccion}`,
        monto: (t.monto || 0).toString(),
        usuario: t.origenRol || 'N/A',
        estado: t.estado || 'N/A',
        fondo: t.fondo || 'Fondo General',
        id: t.idTransaccion,
        fechaRegistro: t.fechaRegistro,
        idFondo: t.idFondo
      }))
      .sort((a, b) => new Date(b.fechaRegistro || 0) - new Date(a.fechaRegistro || 0))
    
    console.log(`✅ Filtros aplicados: ${rows.value.length} transacciones encontradas`)
    estadoConexion.value = `🔍 ${rows.value.length} transacciones filtradas`
  } catch (error) {
    console.error('❌ Error al aplicar filtros:', error)
    estadoConexion.value = `❌ Error en filtros: ${error.message}`
    rows.value = []
  } finally {
    loading.value = false
  }
}

function verDetalle(referencia) {
  const transaccion = rows.value.find(r => r.referencia === referencia)
  if (transaccion && transaccion.id) {
    router.push({ name: 'detalle-transaccion', params: { id: transaccion.id } })
  } else {
    console.error('No se encontró la transacción:', referencia)
  }
}

async function probarConexionBD() {
  probandoConexion.value = true
  estadoConexion.value = '🔄 Probando endpoints...'
  
  try {
    const resultados = await TransactionService.testDatabaseConnection()
    
    const exitosos = resultados.filter(r => r.status === 'success')
    const fallidos = resultados.filter(r => r.status === 'error')
    
    if (exitosos.length > 0) {
      estadoConexion.value = `✅ Conectado! (${exitosos.length}/${resultados.length} endpoints)`
      
      // Intentar recargar datos
      setTimeout(() => {
        cargarTransaccionesDesdeDB()
      }, 1000)
    } else {
      estadoConexion.value = `❌ Sin conexión (${fallidos.length} endpoints fallaron)`
    }
    
    console.log('📊 Resultados de conectividad:', resultados)
  } catch (error) {
    estadoConexion.value = `💥 Error de prueba: ${error.message}`
  } finally {
    probandoConexion.value = false
  }
}

function cargarDatosTemporales() {
  console.warn('⚠️  Cargando datos temporales para prueba de interfaz')
  loading.value = true
  
  try {
    const datosTest = TransactionService.getTemporaryTestData()
    
    rows.value = datosTest.map(t => ({
      tipo: t.tipo,
      fecha: t.fechaFormateada,
      referencia: t.referencia,
      monto: t.monto.toString(),
      usuario: t.usuario,
      estado: t.estado,
      fondo: t.fondo,
      id: t.idTransaccion,
      fechaRegistro: t.fechaRegistro
    }))
    
    estadoConexion.value = '🧪 Datos temporales cargados (solo para testing)'
    console.log('✅ Datos temporales cargados:', rows.value.length)
  } catch (error) {
    console.error('Error cargando datos temporales:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.q-page.historial-page-payflow {
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-top: 32px !important;
}

// Estilos para la tabla de movimientos
.tabla-movimientos-payflow {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;

  th {
    background-color: #f5f5f5;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    font-size: 14px;
    color: #424242;
  }

  td {
    padding: 16px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 14px;
    vertical-align: middle;
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  .payflow-row-interactive {
    transition: background-color 0.2s ease;
  }
}

// Responsive para la tabla
@media (max-width: 768px) {
  .tabla-movimientos-payflow {
    th, td {
      padding: 10px 8px;
      font-size: 13px;
    }
  }
}

@media (max-width: 1100px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 220px;
    max-width: 95vw;
    padding: 12px 8vw !important;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 600px) {
  .filtros-card-compact {
    width: fit-content;
    min-width: 180px;
    max-width: 98vw;
    padding: 8px 2vw !important;
  }
}
</style>
