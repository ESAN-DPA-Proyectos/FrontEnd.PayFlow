import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-api-domain.com/api'
      : 'http://localhost:5283/api',
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para debugging
api.interceptors.request.use((request) => {
  console.log('🌐 API Request:', request.method?.toUpperCase(), request.baseURL + request.url)
  return request
})

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
//     console.error('❌ API Error:', error.config?.url, error.response?.status, error.message)
//
//     // Manejar errores específicos
//     if (error.code === 'ERR_NETWORK') {
//      console.error('🔌 Network Error: Backend no disponible en', error.config?.baseURL)
//     }
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
