<template>
  <div class="retiro-container">
    <div class="retiro-info">
      <div class="retiro-label">Información del fondo</div>
      <q-select
        label="Seleccionar fondo"
        :options="fondos"
        v-model="fondoSeleccionado"
        filled
        class="q-mb-md"
      />
      <div class="q-mb-sm"><b>Saldo disponible:</b> S/ 2,800.00</div>
      <div class="q-mb-sm"><b>Meta</b> S/ 15,000.00</div>
      <div><b>Progreso</b> 18.7 %</div>
    </div>
    <div class="retiro-form">
      <div class="retiro-label">Detalles de solicitud de retiro</div>
      <q-form class="q-mt-md">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input label="Monto a retirar" prefix="S/" filled class="q-mb-md" v-model="monto" />
          </div>
          <div class="col-6">
            <q-select
              label="Método de retiro"
              :options="['Cuenta bancaria / Yape / Plin']"
              filled
              class="q-mb-md"
              v-model="metodo"
              disable
            />
          </div>
        </div>
        <q-input label="Nombre del beneficiario" filled class="q-mb-md" v-model="beneficiario" />
        <q-input label="Cuenta CCI o celular" filled class="q-mb-md" v-model="cuenta" />
        <q-input label="Concepto" type="textarea" filled class="q-mb-md" v-model="concepto" />
        <div class="retiro-btns">
          <q-btn label="Cancelar" class="retiro-btn-cancelar" flat />
          <q-btn
            label="Continuar"
            class="retiro-btn-continuar"
            :disable="!monto || !beneficiario || !cuenta || !concepto"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RetiroPage',
  data() {
    return {
      fondoSeleccionado: null,
      fondos: ['Fondo 1', 'Fondo 2', 'Fondo 3'],
      monto: '',
      metodo: '',
      beneficiario: '',
      cuenta: '',
      concepto: 'Pago por reserva de hospedaje',
    }
  },
}
</script>

<style scoped>
@import 'src/css/payflow-figma.scss';
</style>
