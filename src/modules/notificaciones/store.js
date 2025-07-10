import { defineStore } from 'pinia'

export const useNotificacionesStore = defineStore('notificaciones', {
  state: () => ({
    lista: [
      { id: 1, mensaje: 'Depósito aprobado', leido: false },
      { id: 2, mensaje: 'Retiro pendiente de validación', leido: false },
      { id: 3, mensaje: 'Nuevo mensaje del administrador', leido: true },
    ],
  }),
  getters: {
    nuevasNotificaciones: (state) => state.lista.filter((n) => !n.leido).length,
  },
  actions: {
    marcarComoLeida(id) {
      const notificacion = this.lista.find((n) => n.id === id)
      if (notificacion) {
        notificacion.leido = true
      }
    },
    marcarTodasComoLeidas() {
      this.lista.forEach((n) => {
        n.leido = true
      })
    },
  },
})

