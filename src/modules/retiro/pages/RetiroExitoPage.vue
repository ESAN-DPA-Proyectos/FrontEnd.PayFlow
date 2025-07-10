<template>
  <q-page class="q-pa-xl flex flex-center">
    <div style="max-width: 600px; width: 100%">
      <div class="text-h5 q-mb-lg">Solicitud de Retiro Registrado</div>
      <q-card flat bordered>
        <q-card-section class="text-center">
          <q-icon name="check_circle" size="80px" color="positive" />
          <div class="text-h6 q-mt-md text-bold">
            ¡Solicitud de retiro registrado correctamente!
          </div>
          <div class="q-mt-sm text-orange-7 text-bold">PENDIENTE</div>
          <div class="q-mt-md">
            Tu solicitud de retiro ha sido registrada y será procesada por un administrador del
            fondo
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-mb-xs">
            <div class="col-6 text-left text-grey-8">Monto a retirar</div>
            <div class="col-6 text-right">S/ {{ $route.query.monto }}</div>
          </div>
          <div class="row q-mb-xs">
            <div class="col-6 text-left text-grey-8">Método de retiro</div>
            <div class="col-6 text-right">{{ $route.query.metodo }}</div>
          </div>
          <div class="row q-mb-xs">
            <div class="col-6 text-left text-grey-8">Destino</div>
            <div class="col-6 text-right">{{ $route.query.cuenta }}</div>
          </div>
          <div class="row q-mb-xs">
            <div class="col-6 text-left text-grey-8">Referencia</div>
            <div class="col-6 text-right">#RT-20250422-402</div>
          </div>
          <div class="row q-mb-xs">
            <div class="col-6 text-left text-grey-8">Fecha y hora</div>
            <div class="col-6 text-right">22/04/2025 - 12:30 p.m.</div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <BtnPayflow label="Ver historial" @click="goHistorial" />
          <BtnPayflow label="Volver al inicio" @click="goInicio" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { BtnPayflow } from 'src/components/atomos'
const router = useRouter()
function goHistorial() {
  router.push({ name: 'historial' })
}
function goInicio() {
  router.push({ name: 'home' })
}
</script>
