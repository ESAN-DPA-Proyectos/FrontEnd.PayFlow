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

        <!-- Panel de Administración -->
        <q-btn-dropdown
          flat
          dense
          label="Panel de Administración"
          color="white"
          menu-anchor="bottom left"
          menu-self="top left"
        >
          <q-list style="min-width: 200px">
            <q-item clickable v-ripple :to="{ name: 'admin-validar-comprobantes' }">
              <q-item-section>Validar Comprobantes</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'reportes' }">
              <q-item-section>Generar Reportes</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'admin-asignar-roles' }">
              <q-item-section>Asignar Roles</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

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
import { computed } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'
import { useRoute, useRouter } from 'vue-router'

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
