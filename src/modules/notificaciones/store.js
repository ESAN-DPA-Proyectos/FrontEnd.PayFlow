import { defineStore } from 'pinia'

export const useNotificacionesStore = defineStore('notificaciones', {
  state: () => ({
    lista: [
      {
        id: 1,
        mensaje: 'Solicitud de retiro recibida',
        tipo: 'retiro',
        fecha: '2025-07-09',
        hora: '10:15',
        estado: 'En proceso',
        leido: false,
      },
      {
        id: 2,
        mensaje: 'Depósito aprobado',
        tipo: 'deposito',
        fecha: '2025-07-08',
        hora: '16:40',
        estado: 'Aprobado',
        leido: false,
      },
      {
        id: 3,
        mensaje: 'Solicitud de retiro rechazada',
        tipo: 'retiro',
        fecha: '2025-07-07',
        hora: '09:30',
        estado: 'Rechazado',
        leido: true,
      },
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
