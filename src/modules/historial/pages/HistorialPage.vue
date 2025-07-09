<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Historial de Transacciones</div>
    <q-table class="q-mt-md" :rows="rows" :columns="columns" row-key="id" flat bordered />
  </q-page>
</template>

<script>
export default {
  name: 'HistorialPage',
  data() {
    return {
      columns: [
        { name: 'id', label: 'ID', field: 'id' },
        { name: 'tipo', label: 'Tipo', field: 'tipo' },
        { name: 'fecha', label: 'Fecha', field: 'fecha' },
        { name: 'monto', label: 'Monto', field: 'monto' },
        { name: 'estado', label: 'Estado', field: 'estado' },
      ],
      rows: [
        { id: 1, tipo: 'Depósito', fecha: '2025-05-01', monto: 'S/ 200.00', estado: 'Validado' },
        { id: 2, tipo: 'Retiro', fecha: '2025-05-02', monto: 'S/ 100.00', estado: 'Procesado' },
      ],
    }
  },
}
</script>
