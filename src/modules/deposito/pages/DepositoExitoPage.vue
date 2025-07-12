<template>
  <q-page class="q-pa-xl flex flex-center column">
    <q-card class="q-pa-lg shadow-2" style="max-width: 500px; width: 100%">
      <div class="text-h5 text-primary text-center q-mb-md">¡Depósito realizado con éxito!</div>

      <q-separator spaced />

      <q-list dense>
        <q-item>
          <q-item-section>💰 <strong>Monto:</strong></q-item-section>
          <q-item-section class="text-right">S/ {{ route.query.monto }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>🏦 <strong>Método de Pago:</strong></q-item-section>
          <q-item-section class="text-right">{{ route.query.metodoPago }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>🔢 <strong>Referencia:</strong></q-item-section>
          <q-item-section class="text-right">{{ route.query.referencia }}</q-item-section>
        </q-item>

        <q-item>
          <q-item-section>📝 <strong>Concepto:</strong></q-item-section>
          <q-item-section class="text-right">{{ route.query.concepto }}</q-item-section>
        </q-item>

        <q-item v-if="route.query.comprobante">
          <q-item-section>📎 <strong>Comprobante:</strong></q-item-section>
          <q-item-section class="text-right">
            <a :href="route.query.comprobante" target="_blank" class="text-primary">
              Ver Comprobante
            </a>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator spaced />

      <div class="row justify-center q-gutter-md q-mt-md">
        <q-btn label="Ir al inicio" color="primary" @click="router.push({ name: 'home' })" />
        <q-btn
          label="Nuevo Depósito"
          color="secondary"
          @click="router.push({ name: 'deposito' })"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>
