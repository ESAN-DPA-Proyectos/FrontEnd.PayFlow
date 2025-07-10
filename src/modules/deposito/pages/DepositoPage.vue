<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Realizar Depósito</div>
    <q-form class="q-mt-md">
      <q-input label="Monto (S/)" type="number" filled class="q-mb-md" />
      <q-input label="Referencia del voucher" filled class="q-mb-md" />
      <q-uploader label="Subir imagen del voucher" url="#" auto-expand class="q-mb-md" />
      <q-btn label="Confirmar Depósito" color="primary" />
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'DepositoPage',
}
</script>
