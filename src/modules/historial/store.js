import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import TransactionService from 'src/services/TransactionService'
import FondoService from 'src/services/FondoService'

export const useHistoryStore = defineStore('history', () => {
  // State
  const transactions = ref([])
  const fondos = ref([])
  const currentTransaction = ref(null)
  const loading = ref(false)
  const loadingFondos = ref(false)
  const error = ref(null)
  const filters = ref({
    tipo: '',
    estado: '',
    usuario: '',
    fechaDesde: '',
    fechaHasta: '',
    fondo: ''
  })
  const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    totalRows: 0
  })

  // Getters
  const filteredTransactions = computed(() => {
    if (!transactions.value.length) return []
    
    return transactions.value.filter(transaction => {
      if (filters.value.tipo && transaction.tipo !== filters.value.tipo) return false
      if (filters.value.estado && transaction.estado !== filters.value.estado) return false
      if (filters.value.usuario && transaction.usuario !== filters.value.usuario) return false
      if (filters.value.fondo && transaction.fondo !== filters.value.fondo) return false
      
      if (filters.value.fechaDesde) {
        const transactionDate = new Date(transaction.fechaRegistro)
        const filterDate = new Date(filters.value.fechaDesde)
        if (transactionDate < filterDate) return false
      }
      
      if (filters.value.fechaHasta) {
        const transactionDate = new Date(transaction.fechaRegistro)
        const filterDate = new Date(filters.value.fechaHasta)
        if (transactionDate > filterDate) return false
      }
      
      return true
    })
  })

  const paginatedTransactions = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
    const end = start + pagination.value.rowsPerPage
    return filteredTransactions.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredTransactions.value.length / pagination.value.rowsPerPage)
  })

  // Actions
  async function fetchTransactions() {
    loading.value = true
    error.value = null
    
    try {
      console.log('Store: Obteniendo transacciones desde BD...')
      const data = await TransactionService.getAllTransactions()
      
      transactions.value = data.map(transaction => ({
        ...transaction,
        fechaFormateada: TransactionService.formatFecha(transaction.fechaRegistro),
        montoFormateado: TransactionService.formatMonto(transaction.monto, transaction.tipo)
      }))
      
      pagination.value.totalRows = transactions.value.length
      console.log(`Store: ${transactions.value.length} transacciones cargadas desde BD`)
      
    } catch (err) {
      error.value = 'Error al cargar las transacciones desde la base de datos'
      console.error('Store: Error en fetchTransactions:', err)
      // Los datos mock ya se manejan en el servicio como fallback
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactionById(id) {
    loading.value = true
    error.value = null
    
    try {
      console.log('Store: Obteniendo transacción por ID desde BD:', id)
      const data = await TransactionService.getTransactionById(id)
      
      currentTransaction.value = {
        ...data,
        fechaFormateada: TransactionService.formatFecha(data.fechaRegistro),
        montoFormateado: TransactionService.formatMonto(data.monto, data.tipo)
      }
      
      console.log('Store: Transacción cargada desde BD:', currentTransaction.value)
      return currentTransaction.value
      
    } catch (err) {
      error.value = 'Error al cargar el detalle de la transacción desde la base de datos'
      console.error('Store: Error en fetchTransactionById:', err)
      // Los datos mock ya se manejan en el servicio como fallback
      throw err
    } finally {
      loading.value = false
    }
  }

  async function applyFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page when filtering
    
    try {
      loading.value = true
      const data = await TransactionService.filterTransactions(filters.value)
      transactions.value = data.map(transaction => ({
        ...transaction,
        fechaFormateada: TransactionService.formatFecha(transaction.fechaRegistro),
        montoFormateado: TransactionService.formatMonto(transaction.monto, transaction.tipo)
      }))
    } catch (err) {
      console.error('Error al aplicar filtros:', err)
      // Aplicar filtros localmente en caso de error
    } finally {
      loading.value = false
    }
  }

  function clearFilters() {
    filters.value = {
      tipo: '',
      estado: '',
      usuario: '',
      fechaDesde: '',
      fechaHasta: '',
      fondo: ''
    }
    pagination.value.page = 1
  }

  function setPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      pagination.value.page = page
    }
  }

  function setRowsPerPage(rows) {
    pagination.value.rowsPerPage = rows
    pagination.value.page = 1
  }

  // Mock data functions (para desarrollo y fallback)
  function loadMockData() {
    transactions.value = [
      {
        idTransaccion: 519,
        tipo: 'Retiro',
        monto: 800.00,
        fechaRegistro: '2025-04-22T12:30:00',
        fechaFormateada: '22/04/2025 12:30 p.m.',
        estado: 'Pendiente',
        metodoPago: 'Cuenta bancaria',
        beneficiarioNombre: 'Juan Pérez',
        cuentaBeneficiario: 'IBK - 123 - 524895 - 01',
        concepto: 'Pago por reserva de hospedaje',
        referencia: '#RT-20250422-519',
        usuario: 'gestor.actividad',
        fondo: 'Fondo 1',
        montoFormateado: 'S/ -800.00'
      },
      {
        idTransaccion: 381,
        tipo: 'Retiro',
        monto: 50.00,
        fechaRegistro: '2025-04-18T10:00:00',
        fechaFormateada: '18/04/2025 10:00 a.m.',
        estado: 'Procesado',
        metodoPago: 'Cuenta bancaria',
        beneficiarioNombre: 'María González',
        cuentaBeneficiario: 'BCP - 456 - 789012 - 34',
        concepto: 'Pago de servicios',
        referencia: '#RT-20250418-381',
        usuario: 'gestor.actividad',
        fondo: 'Fondo 1',
        montoFormateado: 'S/ -50.00'
      },
      {
        idTransaccion: 322,
        tipo: 'Deposito',
        monto: 1500.00,
        fechaRegistro: '2025-04-14T14:32:00',
        fechaFormateada: '14/04/2025 02:32 p.m.',
        estado: 'Procesado',
        metodoPago: 'Transferencia bancaria',
        concepto: 'Aporte mensual',
        referencia: '#DP-20250414-322',
        usuario: 'luis.garcia',
        fondo: 'Fondo 1',
        montoFormateado: 'S/ 1500.00'
      },
      {
        idTransaccion: 201,
        tipo: 'Retiro',
        monto: 2500.00,
        fechaRegistro: '2025-04-10T08:08:00',
        fechaFormateada: '10/04/2025 08:08 a.m.',
        estado: 'Procesado',
        metodoPago: 'Cuenta bancaria',
        beneficiarioNombre: 'Carlos Rodríguez',
        cuentaBeneficiario: 'BBVA - 789 - 123456 - 78',
        concepto: 'Pago por evento',
        referencia: '#RT-20250410-201',
        usuario: 'gestor.actividad',
        fondo: 'Fondo 2',
        montoFormateado: 'S/ -2500.00'
      },
      {
        idTransaccion: 98,
        tipo: 'Deposito',
        monto: 1100.00,
        fechaRegistro: '2025-04-03T00:11:00',
        fechaFormateada: '03/04/2025 12:11 a.m.',
        estado: 'Procesado',
        metodoPago: 'Transferencia bancaria',
        concepto: 'Aporte especial',
        referencia: '#DP-20250403-098',
        usuario: 'pedro.ruiz',
        fondo: 'Fondo 2',
        montoFormateado: 'S/ 1100.00'
      }
    ]
    pagination.value.totalRows = transactions.value.length
  }

  async function fetchFondos() {
    loadingFondos.value = true
    try {
      console.log('Store: Cargando fondos desde BD...')
      const fondosData = await FondoService.getAllFondos()
      console.log('Store: Fondos recibidos:', fondosData)
      
      // Asegurar que fondosData es un array
      const fondosArray = Array.isArray(fondosData) ? fondosData : []
      fondos.value = FondoService.formatFondosForSelect(fondosArray)
      
      console.log('Store: Fondos formateados:', fondos.value)
      console.log('Store: Total fondos cargados:', fondos.value.length)
    } catch (err) {
      console.error('Store: Error al cargar fondos:', err)
      // Usar fondos por defecto en caso de error
      const fondosDefecto = FondoService.getFondosDefecto()
      fondos.value = FondoService.formatFondosForSelect(fondosDefecto)
      console.log('Store: Usando fondos por defecto:', fondos.value)
    } finally {
      loadingFondos.value = false
    }
  }

  return {
    // State
    transactions,
    fondos,
    currentTransaction,
    loading,
    loadingFondos,
    error,
    filters,
    pagination,
    
    // Getters
    filteredTransactions,
    paginatedTransactions,
    totalPages,
    
    // Actions
    fetchTransactions,
    fetchTransactionById,
    fetchFondos,
    applyFilters,
    clearFilters,
    setPage,
    setRowsPerPage,
    loadMockData
  }
})
