// Exporta el store y componentes principales del módulo historial
export { useHistoryStore } from './store'
export * from './components'

// Re-exporta las páginas principales
export { default as HistorialPage } from './pages/HistorialPage.vue'
export { default as DetalleTransaccionPage } from './pages/DetalleTransaccionPage.vue'
