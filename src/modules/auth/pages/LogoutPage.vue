<template>
  <q-page class="q-pa-xl flex flex-center">
    <q-card class="q-pa-lg text-center">
      <q-icon name="lock" size="64px" color="grey-8" />
      <div class="text-h6 q-mt-md">Sesión cerrada</div>
      <div class="text-subtitle2 text-grey">Gracias por usar PayFlow</div>
      <q-btn label="Volver al login" to="/" class="q-mt-md" color="primary" />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'LogoutPage',
}
</script>
