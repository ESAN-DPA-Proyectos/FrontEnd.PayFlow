<template>
  <q-layout view="lHh Lpr lFf">
    <!-- CABECERA -->
    <q-header elevated class="bg-indigo-10 text-white">
      <div class="column">
        <!-- Barra superior -->
        <q-toolbar class="q-gutter-md row items-center justify-between" style="height: 60px">
          <div class="row items-center">
            <q-toolbar-title class="text-weight-bold text-h5">PayFlow</q-toolbar-title>
          </div>
          <q-img src="/assets/logo-payflow.png" style="height: 50px; width: auto" />
        </q-toolbar>

        <!-- Menú de navegación -->
        <q-tabs
          dense
          align="right"
          active-color="white"
          indicator-color="white"
          narrow-indicator
          class="bg-primary text-white shadow-2 q-px-md"
        >
          <!-- Acceso general -->
          <q-route-tab to="/" label="Inicio" icon="home" />
          <q-route-tab to="/deposito" label="Depósito" icon="account_balance_wallet" />
          <q-route-tab to="/retiro" label="Retiro" icon="payments" />
          <q-route-tab to="/historial" label="Historial" icon="history" />
          <q-route-tab to="/notificaciones">
            <q-badge floating color="red" v-if="nuevasNotificaciones > 0" align="top right">
              {{ nuevasNotificaciones }}
            </q-badge>
            <q-icon name="notifications" />
            <span class="q-tab__label">Notificaciones</span>
          </q-route-tab>

          <!-- Acceso exclusivo para ADMIN -->
          <q-route-tab v-if="isAdmin" to="/validaciones" label="Validaciones" icon="assignment" />
          <q-route-tab v-if="isAdmin" to="/mantenimiento" label="Mantenimiento" icon="build" />
          <q-route-tab v-if="isAdmin" to="/reportes" label="Reportes" icon="bar_chart" />

          <!-- Logout -->
          <q-route-tab to="/logout" label="Cerrar sesión" icon="logout" />
        </q-tabs>
      </div>
    </q-header>

    <!-- Vista dinámica de páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'
import { useNotificacionesStore } from 'src/modules/notificaciones/store'

const auth = useAuthStore()
const notificaciones = useNotificacionesStore()

const isAdmin = computed(() => auth.user?.role === 'admin')

// Cuenta las notificaciones no leídas
const nuevasNotificaciones = computed(() => notificaciones.lista.filter((n) => !n.leido).length)
</script>
