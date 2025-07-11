<template>
  <q-page class="q-pa-xl payflow-page-bg">
    <div class="payflow-section-title q-mb-lg">Realizar Depósito</div>
    <q-form class="q-mt-md">
      <q-input label="Monto (S/)" type="number" filled class="q-mb-md" />
      <q-input label="Referencia del voucher" filled class="q-mb-md" />
      <q-uploader label="Subir imagen del voucher" url="#" auto-expand class="q-mb-md" />
      <div class="q-pa-md flex flex-center">
        <div>
          <BtnPayflow label="Confirmar Depósito" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'DepositoPage',
}
</script>

<style scoped></style>
