<template>
  <q-page class="q-pa-md flex justify-center">
    <div class="q-pa-md" style="max-width: 1280px; width: 100%">
      <h6 class="text-h6 q-mb-md">Bienvenido, Juan Pérez</h6>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2">Resumen de Cuenta</div>
          <div>
            Saldo actual: <strong>{{ formatCurrency(balance) }}</strong>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2">Últimas Transacciones</div>
          <q-markup-table dense flat bordered>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in recentTransactions" :key="t.id">
                <td>{{ t.tipo }}</td>
                <td>{{ formatDate(t.fecha) }}</td>
                <td>{{ formatCurrency(t.monto) }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6">
          <q-btn label="Ir a Depósito" color="primary" class="full-width" to="/deposito" />
        </div>
        <div class="col-6">
          <q-btn label="Ir a Retiro" color="secondary" class="full-width" to="/retiro" />
        </div>
      </div>

      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-subtitle2">Panel Administrativo</div>
          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-auto">
              <q-btn label="Validar Comprobantes" to="/admin" color="dark" />
            </div>
            <div class="col-auto">
              <q-btn label="Reportes" to="/reportes" color="dark" />
            </div>
            <div class="col-auto">
              <q-btn label="Mantenimiento" to="/mantenimiento" color="dark" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Funciones locales para formato de moneda y fecha
function formatCurrency(valor) {
  return `S/ ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`
}

function formatDate(fecha) {
  // Suponiendo formato '2025-07-04' -> '04/07/2025'
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

// Simulación de datos
const balance = 1250.0
const recentTransactions = ref([
  { id: 1, tipo: 'Depósito', fecha: '2025-07-04', monto: 300 },
  { id: 2, tipo: 'Retiro', fecha: '2025-07-02', monto: 150 },
  { id: 3, tipo: 'Depósito', fecha: '2025-06-30', monto: 500 },
])
</script>
