import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Configuración para el backend de PayFlow
const api = axios.create({
  baseURL: 'http://localhost:5283', ///borré el /api al final
})
//  headers: {
//    'Content-Type': 'application/json',
//  },

// Interceptor para manejar respuestas
// Iapi.interceptors.response.use(
//  (response) => {
//    console.log('✅ API Response:', response.config.url, response.status)
//     return response
//   },
//   (error) => {
//     console.error('❌ API Error:', error.config?.url, error.response?.status, error.message)
//
//     // Manejar errores específicos
//     if (error.code === 'ERR_NETWORK') {
//      console.error('🔌 Network Error: Backend no disponible en', error.config?.baseURL)
//     }
//
//     return Promise.reject(error)
//   },
// )

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
