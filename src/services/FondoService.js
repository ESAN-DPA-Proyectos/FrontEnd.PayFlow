import axios from 'axios'

class FondoService {
  /**
   * Obtener todos los fondos desde la base de datos
   */
  async getAllFondos() {
    try {
      console.log('📂 FondoService: Iniciando petición a /api/v1/Funds...')
      
      const response = await axios.get('/api/v1/Funds')
      
      console.log('📂 FondoService: Respuesta exitosa:', response.status)
      console.log('📂 FondoService: Respuesta completa:', response)
      console.log('📂 FondoService: Datos recibidos:', response.data)
      console.log('📂 FondoService: Tipo de datos:', typeof response.data)
      console.log('📂 FondoService: Es array:', Array.isArray(response.data))
      
      // El backend puede devolver los datos de diferentes maneras
      let fondos = response.data
      
      // Si la respuesta tiene una propiedad que contiene el array
      if (response.data && response.data.data) {
        fondos = response.data.data
        console.log('📂 FondoService: Usando response.data.data:', fondos)
      } else if (response.data && response.data.result) {
        fondos = response.data.result
        console.log('📂 FondoService: Usando response.data.result:', fondos)
      } else if (response.data && response.data.items) {
        fondos = response.data.items
        console.log('📂 FondoService: Usando response.data.items:', fondos)
      }
      
      console.log('📂 FondoService: Fondos procesados:', fondos)
      console.log('📂 FondoService: Es array fondos:', Array.isArray(fondos))
      console.log('✅ FondoService: Fondos obtenidos:', fondos?.length || 0)
      
      // Asegurar que siempre devolvemos un array
      const fondosArray = Array.isArray(fondos) ? fondos : []
      
      // Si no hay fondos del backend, usar fondos por defecto
      if (fondosArray.length === 0) {
        console.info('ℹ️  FondoService: Backend sin fondos configurados, usando fondos por defecto')
        return this.getFondosDefecto()
      }
      
      return fondosArray
    } catch (error) {
      console.error('❌ FondoService: Error detallado al obtener fondos:', error)
      console.error('❌ FondoService: Error message:', error.message)
      console.error('❌ FondoService: Error response:', error.response)
      
      // Para cualquier error, usar fondos por defecto
      console.warn('⚠️  FondoService: Error, usando fondos por defecto')
      return this.getFondosDefecto()
    }
  }

  /**
   * Crear un nuevo fondo
   */

  async createFondo(fondoData) {
    try {
      console.log('📂 Creando nuevo fondo:', fondoData)
      
      const response = await axios.post('/api/v1/Funds', fondoData)
      
      console.log('✅ Fondo creado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al crear fondo:', error)
      throw error
    }
  }

  /**
   * Actualizar un fondo existente
   */
  async updateFondo(id, fondoData) {
    try {
      console.log('📂 Actualizando fondo ID:', id, fondoData)
      
      const response = await axios.put(`/api/v1/Funds/${id}`, fondoData)
      
      console.log('✅ Fondo actualizado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al actualizar fondo:', error)
      throw error
    }
  }

  /**
   * Eliminar un fondo
   */
  async deleteFondo(id) {
    try {
      console.log('📂 Eliminando fondo ID:', id)
      
      const response = await axios.delete(`/api/v1/Funds/${id}`)
      
      console.log('✅ Fondo eliminado exitosamente')
      return response.data
    } catch (error) {
      console.error('❌ Error al eliminar fondo:', error)
      throw error
    }
  }

  /**
   * Obtener fondos por defecto cuando no hay conexión a BD
   */
  getFondosDefecto() {
    return [
      {
        idFondo: 4,
        nombre: 'Fondo General',
        descripcion: 'Fondo general para gastos diversos y operaciones básicas',
        aportePorAsociado: 50.00,
        meta: 5000.00,
        saldoActual: 3200.00,
        estado: 'activo'
      },
      {
        idFondo: 2,
        nombre: 'Viaje de promoción a Cusco',
        descripcion: 'Fondo específico para financiar el viaje de promoción a la ciudad de Cusco',
        aportePorAsociado: 150.00,
        meta: 15000.00,
        saldoActual: 12450.00,
        estado: 'activo'
      },
      {
        idFondo: 1,
        nombre: 'Viaje a museo de Sitio de Chan Chan',
        descripcion: 'Fondo para el viaje educativo al museo de Sitio de Chan Chan en Trujillo',
        aportePorAsociado: 100.00,
        meta: 8000.00,
        saldoActual: 5600.00,
        estado: 'activo'
      }
    ]
  }

  /**
   * Formatear fondos para usar en selects de Quasar
   */
  formatFondosForSelect(fondos) {
    if (!Array.isArray(fondos)) return []
    
    console.log('📂 Formateando fondos para select:', fondos)
    
    const fondosFormateados = fondos
      .filter(fondo => {
        console.log('📂 Verificando fondo:', fondo.nombre, 'Estado:', fondo.estado)
        return fondo.estado === 'activo' || fondo.estado === 'Activo' // Aceptar ambos casos
      })
      .map(fondo => ({
        label: fondo.nombre,
        value: fondo.idFondo, // Usar idFondo del backend
        description: fondo.descripcion
      }))
    
    console.log('✅ Fondos formateados:', fondosFormateados)
    return fondosFormateados
  }

  /**
   * Buscar fondo por ID
   */
  async getFondoById(id) {
    try {
      console.log('📂 Obteniendo fondo por ID:', id)
      
      const response = await axios.get(`/api/v1/Funds/${id}`)
      
      console.log('✅ Fondo encontrado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error al obtener fondo por ID:', error)
      
      // Buscar en fondos por defecto si hay error
      const fondosDefecto = this.getFondosDefecto()
      const fondoDefecto = fondosDefecto.find(f => f.id === parseInt(id))
      
      if (fondoDefecto) {
        console.warn('⚠️  Usando fondo por defecto:', fondoDefecto)
        return fondoDefecto
      }
      
      throw error
    }
  }

  /**
   * Obtener el nombre del fondo por ID (para mostrar en tablas)
   */
  async getNombreFondo(idFondo) {
    try {
      if (!idFondo) return 'Fondo General'
      
      const fondo = await this.getFondoById(idFondo)
      return fondo?.nombre || 'Fondo Desconocido'
    } catch (error) {
      console.error('❌ Error al obtener nombre del fondo:', error)
      
      // Mapeo de fondos conocidos
      const fondosConocidos = {
        1: 'Viaje de estudios',
        2: 'Viaje de promoción a Cusco',
        3: 'Viaje a museo de Sitio de Chan Chan',
        4: 'Fondo General'
      }
      
      return fondosConocidos[idFondo] || 'Fondo General'
    }
  }

  /**
   * Validar datos de fondo antes de enviar a la API
   */
  validarDatosFondo(fondoData) {
    const errores = []
    
    if (!fondoData.nombre || fondoData.nombre.trim().length === 0) {
      errores.push('El nombre del fondo es obligatorio')
    }
    
    if (fondoData.nombre && fondoData.nombre.length > 100) {
      errores.push('El nombre del fondo no puede exceder 100 caracteres')
    }
    
    if (fondoData.descripcion && fondoData.descripcion.length > 500) {
      errores.push('La descripción no puede exceder 500 caracteres')
    }
    
    return {
      valido: errores.length === 0,
      errores
    }
  }
}

export default new FondoService()
