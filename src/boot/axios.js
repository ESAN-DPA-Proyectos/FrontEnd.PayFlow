import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Configuración para el backend de PayFlow
const api = axios.create({
  baseURL: 'http://localhost:5283/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, error.response?.status, error.message)

    // Manejar errores específicos
    if (error.code === 'ERR_NETWORK') {
      console.error('🔌 Network Error: Backend no disponible en', error.config?.baseURL)
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
