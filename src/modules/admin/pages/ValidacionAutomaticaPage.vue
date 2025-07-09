<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Validación Automática</div>
    <q-table class="q-mt-md" :rows="rows" :columns="columns" row-key="id" flat bordered />
  </q-page>
</template>

<script>
export default {
  name: 'ValidacionAutomaticaPage',
  data() {
    return {
      columns: [
        { name: 'id', label: 'ID', field: 'id' },
        { name: 'usuario', label: 'Usuario', field: 'usuario' },
        { name: 'fecha', label: 'Fecha', field: 'fecha' },
        { name: 'monto', label: 'Monto', field: 'monto' },
        { name: 'resultado', label: 'Resultado', field: 'resultado' },
      ],
      rows: [
        {
          id: 101,
          usuario: 'jperez',
          fecha: '2025-05-05',
          monto: 'S/ 250.00',
          resultado: 'Validado automáticamente',
        },
        {
          id: 102,
          usuario: 'mrodriguez',
          fecha: '2025-05-06',
          monto: 'S/ 180.00',
          resultado: 'Observado - revisión manual',
        },
      ],
    }
  },
}
</script>
