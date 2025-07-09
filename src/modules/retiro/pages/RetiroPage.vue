<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Registrar Solicitud de Retiro</div>
    <q-form class="q-mt-md">
      <q-select
        label="Tipo de Fondo"
        :options="fondos"
        v-model="fondoSeleccionado"
        filled
        class="q-mb-md"
      />

      <q-input label="Monto a retirar (S/)" type="number" filled class="q-mb-md" />

      <q-input label="Cuenta destino" filled class="q-mb-md" />

      <q-input label="Nombre del beneficiario" filled class="q-mb-md" />

      <q-input label="Concepto" type="textarea" filled class="q-mb-md" />

      <q-btn label="Solicitar Retiro" color="primary" />
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'RetiroPage',
  data() {
    return {
      fondoSeleccionado: null,
      fondos: ['Fondo 1', 'Fondo 2', 'Fondo 3'],
    }
  },
}
</script>
