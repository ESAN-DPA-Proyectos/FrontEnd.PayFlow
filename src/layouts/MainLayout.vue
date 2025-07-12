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
          align-items: center;
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
            alt="Logo de Payflow"
            style="height: 96px; width: 96px; min-width: 96px; margin: 0"
          />
        </div>
      </div>
    </div>
    <!-- Menú de navegación -->
    <div class="navbar-payflow" style="width: 100%; background: #0656b6">
      <q-tabs
        dense
        align="center"
        active-color="white"
        indicator-color="white"
        narrow-indicator
        class="payflow-tabs"
        style="min-width: 700px"
      >
        <q-route-tab to="/" label="Inicio" exact />
        <q-route-tab to="/deposito" label="Depósito" />
        <!-- Pestaña Retiro personalizada -->
        <q-tab
          label="Retiro"
          :active="isRetiroActive"
          @click="goRetiro"
          active-class="q-tab--active"
        />
        <!-- Pestaña Historial personalizada -->
        <q-tab
          label="Historial"
          :active="isHistorialActive"
          @click="goHistorial"
          active-class="q-tab--active"
        />
        <q-route-tab v-if="isAdmin" to="/validaciones" label="Validaciones" />
        <q-route-tab v-if="isAdmin" to="/admin/fondos" label="Gestión Fondos" />
        <q-route-tab v-if="isAdmin" to="/mantenimiento" label="Mantenimiento" />
        <q-route-tab v-if="isAdmin" to="/reportes" label="Reportes" />
        <q-route-tab to="/logout" label="Cerrar sesión" />
      </q-tabs>
    </div>
    <!-- Vista dinámica de páginas -->
    <q-page-container>
      <div style="max-width: 1200px; margin: 0 auto; padding: 24px 16px; box-sizing: border-box">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const isAdmin = computed(() => auth.user?.role === 'admin')
const route = useRoute()
const router = useRouter()

// Nombres de rutas donde la pestaña Retiro debe quedar activa
const retiroRoutes = ['retiro', 'retiro-confirmar', 'retiro-exito']
const isRetiroActive = computed(() => retiroRoutes.includes(route.name))

// Nombres de rutas donde la pestaña Historial debe quedar activa
const historialRoutes = ['historial', 'detalle-transaccion']
const isHistorialActive = computed(() => historialRoutes.includes(route.name))

function goRetiro() {
  router.push('/retiro')
}

function goHistorial() {
  router.push('/historial')
}

function mostrarRol(rol) {
  if (rol === 'admin') return 'Administrador'
  if (rol === 'gestor') return 'Gestor Actividad'
  return rol.charAt(0).toUpperCase() + rol.slice(1)
}
</script>

<style lang="scss">
.btn-payflow {
  background: #004b8d !important;
  color: #fff !important;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  transition: background 0.2s;
}
.btn-payflow:hover,
.btn-payflow:focus {
  background: #00396b !important;
  color: #fff !important;
}
</style>
