<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-xl shadow-2 text-center" style="width: 400px">
      <q-img src="/img/logo-payflow.png" style="height: 80px; width: auto" class="q-mb-md" />
      <div class="text-h5 text-primary q-mb-sm">Bienvenido a PayFlow</div>
      <div class="text-body2 text-grey-8 q-mb-lg">
        Gestiona tus transacciones de forma segura y eficiente.
      </div>
      <q-btn
        label="Iniciar Sesión"
        color="primary"
        class="q-mb-sm full-width"
        @click="$router.push('/login')"
      />
      <q-btn
        label="Crear Cuenta"
        outline
        color="primary"
        class="full-width"
        @click="$router.push('/register')"
      />
    </q-card>
  </q-page>
</template>

<script setup></script>
