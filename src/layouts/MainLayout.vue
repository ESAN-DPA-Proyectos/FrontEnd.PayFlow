<template>
  <q-layout view="lHh Lpr lFf">
    <!-- CABECERA -->
    <div
      class="header-payflow"
      style="
        background: #0a234b;
        color: #fff;
        padding: 0 32px;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.18);
      "
    >
      <div
        style="
          display: flex;
          align-items: center; /* Cambiado para centrar verticalmente */
          width: 100%;
          justify-content: space-between;
          min-height: 100px;
        "
      >
        <div style="display: flex; align-items: center; gap: 24px">
          <div
            class="payflow-title"
            style="
              font-size: 2.8rem;
              font-weight: bold;
              letter-spacing: 1px;
              margin-left: 12px;
              margin-top: 8px;
            "
          >
            PAYFLOW
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 18px">
          <div
            style="display: flex; flex-direction: column; align-items: flex-end; text-align: right"
          >
            <div style="font-size: 1.4rem; font-weight: 500; margin-bottom: 2px">
              Bienvenido, {{ auth.user?.name || 'usuario' }}
            </div>
            <div style="font-size: 1.1rem; color: #7fd1e8; font-weight: 400; margin-bottom: 0">
              {{ auth.user?.role ? mostrarRol(auth.user.role) : '' }}
            </div>
          </div>
          <q-img
            src="src/assets/logo-payflow.png"
            style="height: 96px; width: 96px; min-width: 96px; margin: 0"
          />
        </div>
      </div>
    </div>
    <!-- Menú de navegación -->
    <div class="navbar-payflow">
      <q-tabs
        dense
        align="left"
        active-color="white"
        indicator-color="white"
        narrow-indicator
        class="payflow-tabs"
        style="margin-left: 0"
      >
        <q-route-tab to="/" label="Inicio" />
        <q-route-tab to="/deposito" label="Depósito" />
        <q-route-tab to="/retiro" label="Retiro" />
        <q-route-tab to="/historial" label="Historial" />
        <q-route-tab v-if="isAdmin" to="/validaciones" label="Validaciones" />
        <q-route-tab v-if="isAdmin" to="/mantenimiento" label="Mantenimiento" />
        <q-route-tab v-if="isAdmin" to="/reportes" label="Reportes" />
        <q-route-tab to="/logout" label="Cerrar sesión" />
      </q-tabs>
    </div>
    <!-- Vista dinámica de páginas -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'

const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')

function mostrarRol(rol) {
  if (rol === 'admin') return 'Administrador'
  if (rol === 'gestor') return 'Gestor Actividad'
  return rol.charAt(0).toUpperCase() + rol.slice(1)
}
</script>

<style lang="scss">
@import 'src/css/payflow-figma.scss';
</style>
