<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Resumen General</div>
    <q-separator class="q-my-md" />
    <div class="row q-col-gutter-md">
      <q-card class="col bg-blue-1">
        <q-card-section>
          <div class="text-subtitle1">Saldo actual</div>
          <div class="text-h6">S/ 1,500.00</div>
        </q-card-section>
      </q-card>
      <q-card class="col bg-green-1">
        <q-card-section>
          <div class="text-subtitle1">Depósitos</div>
          <div class="text-h6">5</div>
        </q-card-section>
      </q-card>
      <q-card class="col bg-red-1">
        <q-card-section>
          <div class="text-subtitle1">Retiros</div>
          <div class="text-h6">2</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'DashboardPage',
}
</script>
