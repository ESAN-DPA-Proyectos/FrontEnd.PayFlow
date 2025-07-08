import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    loginSimulado(email) {
      this.token = 'simulated-token'
      this.user = { name: 'Usuario Prueba', email, role: 'admin' }
    },
    logout() {
      this.token = null
      this.user = null
    },
  },
})
