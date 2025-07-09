<template>
  <q-page class="q-pa-xl">
    <q-card class="q-pa-md">
      <div class="text-h6">Detalle del Comprobante</div>
      <q-separator class="q-my-sm" />
      <div><strong>Usuario:</strong> mjose123</div>
      <div><strong>Fecha:</strong> 2025-05-01</div>
      <div><strong>Monto:</strong> S/ 100.00</div>
      <div><strong>Estado:</strong> Pendiente</div>
      <div class="q-mt-md">
        <strong>Observaciones:</strong>
        <q-input type="textarea" filled autogrow />
      </div>
      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col">
          <q-btn label="Aprobar" color="positive" class="full-width" />
        </div>
        <div class="col">
          <q-btn label="Rechazar" color="negative" class="full-width" />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ComprobanteDetallePage',
}
</script>
