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
            <div style="font-size: 1.4rem; font-weight: 500; margin-bottom: 0">
              Bienvenido, {{ auth.user?.nombre || 'usuario' }}
            </div>
          </div>

          <!-- Ícono de notificaciones -->
          <q-btn flat round dense icon="notifications" @click="router.push('/notificaciones')">
            <q-badge color="red" floating transparent v-if="tieneNotificaciones" />
          </q-btn>

          <q-img
            src="src/assets/logo-payflow.png"
            alt="Logo de Payflow"
            style="height: 96px; width: 96px; min-width: 96px; margin: 0"
          />
        </div>
      </div>
    </div>

    <!-- MENÚ DE NAVEGACIÓN -->
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
        <q-tab
          label="Retiro"
          :active="isRetiroActive"
          @click="goRetiro"
          active-class="q-tab--active"
        />
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

    <!-- CONTENEDOR DE PÁGINA -->
    <q-page-container>
      <div style="max-width: 1200px; margin: 0 auto; padding: 24px 16px; box-sizing: border-box">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'boot/axios'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const retiroRoutes = ['retiro', 'retiro-confirmar', 'retiro-exito']
const historialRoutes = ['historial', 'detalle-transaccion']

const isRetiroActive = computed(() => retiroRoutes.includes(route.name))
const isHistorialActive = computed(() => historialRoutes.includes(route.name))

function goRetiro() {
  router.push('/retiro')
}
function goHistorial() {
  router.push('/historial')
}

const tieneNotificaciones = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/notificaciones')
    tieneNotificaciones.value = (data.length || 0) > 0
  } catch {
    // Si hay error, asumimos que no hay notificaciones pendientes
    tieneNotificaciones.value = false
  }
})
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
