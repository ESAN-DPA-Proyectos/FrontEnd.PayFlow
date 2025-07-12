# Módulo de Historial - PayFlow

Este módulo contiene todas las funcionalidades relacionadas con el historial de transacciones en PayFlow.

## Estructura del Módulo

```
src/modules/historial/
├── components/
│   ├── TransactionList.vue      # Lista de transacciones con paginación
│   ├── TransactionFilters.vue   # Filtros avanzados para transacciones
│   ├── TransactionTracking.vue  # Seguimiento de transacciones
│   └── index.js                 # Exportaciones de componentes
├── pages/
│   ├── HistorialPage.vue        # Página principal del historial
│   └── DetalleTransaccionPage.vue # Página de detalle de transacción
├── store.js                     # Store de Pinia para el historial
└── index.js                     # Exportaciones del módulo
```

## Servicios Utilizados

- **TransactionService**: Servicio para interactuar con la API de transacciones
  - `getAllTransactions()`: Obtiene todas las transacciones
  - `getTransactionById(id)`: Obtiene una transacción específica
  - `filterTransactions(filters)`: Filtra transacciones
  - `getTransactionTracking(id)`: Obtiene el seguimiento de una transacción

## Store (Pinia)

El store `useHistoryStore` maneja el estado global del módulo:

### Estado
- `transactions`: Array de transacciones
- `currentTransaction`: Transacción actual en detalle
- `loading`: Estado de carga
- `error`: Mensajes de error
- `filters`: Filtros aplicados
- `pagination`: Configuración de paginación

### Acciones
- `fetchTransactions()`: Carga las transacciones
- `fetchTransactionById(id)`: Carga una transacción específica
- `applyFilters(filters)`: Aplica filtros
- `clearFilters()`: Limpia los filtros
- `setPage(page)`: Cambia de página

## Componentes

### TransactionList
Muestra la tabla de transacciones con:
- Iconos para tipos de transacción
- Estados con colores
- Paginación
- Acciones (ver detalle)

**Props:**
- `transactions`: Array de transacciones
- `loading`: Estado de carga
- `currentPage`: Página actual
- `totalPages`: Total de páginas
- `totalTransactions`: Total de transacciones

**Eventos:**
- `view-detail`: Al hacer clic en "Detalle"
- `page-change`: Al cambiar de página

### TransactionFilters
Filtros avanzados para transacciones:
- Filtro por fondo
- Rango de fechas
- Tipo de transacción
- Estado
- Usuario
- Botones de aplicar/limpiar

**Props:**
- `filters`: Objeto con filtros actuales
- `loading`: Estado de carga

**Eventos:**
- `apply-filters`: Al aplicar filtros
- `clear-filters`: Al limpiar filtros

### TransactionTracking
Seguimiento visual de transacciones:
- Timeline con estados
- Iconos de estado
- Fechas y descripciones
- Animaciones

**Props:**
- `trackingSteps`: Array de pasos de seguimiento
- `loading`: Estado de carga

**Eventos:**
- `refresh`: Al solicitar actualización

## Rutas

```javascript
{
  path: 'historial',
  name: 'historial',
  component: () => import('src/modules/historial/pages/HistorialPage.vue'),
},
{
  path: 'historial/detalle/:id',
  name: 'detalle-transaccion',
  component: () => import('src/modules/historial/pages/DetalleTransaccionPage.vue'),
}
```

## Estilos

Los estilos están definidos en `src/css/payflow-figma.scss` y incluyen:
- Clases para filtros responsive
- Estilos de tabla
- Animaciones de interacción
- Timeline de seguimiento
- Variables CSS personalizadas

### Clases principales:
- `.historial-page-payflow`: Contenedor principal
- `.filtros-card-compact`: Card de filtros
- `.tabla-movimientos-payflow`: Tabla de transacciones
- `.payflow-row-interactive`: Filas interactivas
- `.timeline-item`: Elementos del timeline

## Uso

### En una página:
```vue
<script setup>
import { useHistoryStore } from 'src/modules/historial'

const historyStore = useHistoryStore()

// Cargar transacciones
await historyStore.fetchTransactions()
</script>
```

### Navegación:
```javascript
// Ir al historial
router.push({ name: 'historial' })

// Ver detalle de transacción
router.push({ 
  name: 'detalle-transaccion', 
  params: { id: transactionId } 
})
```

## Integración con API

El módulo está diseñado para funcionar con el controlador de transacciones:

```csharp
[HttpGet]
public async Task<IActionResult> GetAllTransactions()

[HttpGet("{id:int}")]
public async Task<IActionResult> GetTransaccionesById(int id)

[HttpPost]
public async Task<IActionResult> AddTransacciones([FromBody] TransaccionesCreateDTO transaccionesCreateDTO)

[HttpPut("{id:int}")]
public async Task<IActionResult> UpdateTransacciones(int id, [FromBody] TransaccionesListDTO transaccionesListDTO)
```

## Datos Mock

El módulo incluye datos mock para desarrollo y testing, permitiendo funcionar sin conexión al backend.

## Responsive Design

Todas las vistas están optimizadas para:
- Desktop (> 1100px)
- Tablet (600px - 1100px)
- Mobile (< 600px)

## Dependencias

- Vue 3 con Composition API
- Pinia para manejo de estado
- Quasar Framework para UI
- Axios para peticiones HTTP
- Vue Router para navegación
