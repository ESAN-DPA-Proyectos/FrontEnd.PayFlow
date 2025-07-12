<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nada aquí...</div>

      <div class="q-pa-md flex flex-center">
        <BtnPayflow label="Ir a Depósito" class="full-width" to="/deposito" />
        <BtnPayflow label="Ir a Retiro" class="full-width" to="/retiro" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { BtnPayflow } from 'src/components/atomos'
</script>
