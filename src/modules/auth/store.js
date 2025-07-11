import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    login(usuario) {
      // Si tu backend retorna un token, puedes agregarlo aquí
      // this.token = token
      this.user = usuario
    },
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
