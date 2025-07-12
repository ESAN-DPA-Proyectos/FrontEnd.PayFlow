<template>
  <div class="retiro-form">
    <div class="retiro-label">Detalles de solicitud de retiro</div>
    <q-form class="q-mt-md" @submit.prevent="$emit('submit')">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input
            label="Monto a retirar"
            prefix="S/"
            filled
            class="q-mb-md"
            :model-value="monto"
            @update:model-value="$emit('update:monto', $event)"
          />
        </div>
        <div class="col-6">
          <q-select
            label="Método de retiro"
            :options="metodosRetiro"
            filled
            class="q-mb-md"
            :model-value="metodoRetiro"
            @update:model-value="$emit('update:metodoRetiro', $event)"
            disable
          />
        </div>
      </div>

      <q-input
        label="Nombre del beneficiario"
        filled
        class="q-mb-md"
        :model-value="beneficiario"
        @update:model-value="$emit('update:beneficiario', $event)"
      />

      <q-input
        label="Cuenta CCI o celular"
        filled
        class="q-mb-md"
        :model-value="cuentaDestino"
        @update:model-value="$emit('update:cuentaDestino', $event)"
      />

      <q-input
        label="Concepto"
        type="textarea"
        filled
        class="q-mb-md"
        :model-value="concepto"
        @update:model-value="$emit('update:concepto', $event)"
      />

      <div class="retiro-btns">
        <q-btn label="Cancelar" class="retiro-btn-cancelar" flat @click="$emit('cancel')" />
        <BtnPayflow
          label="Continuar"
          class="retiro-btn-continuar"
          :disable="!formularioValido"
          :loading="loading"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { BtnPayflow } from 'src/components/atomos'

export default {
  name: 'RetiroForm',
  components: { BtnPayflow },

  emits: [
    'submit',
    'cancel',
    'update:monto',
    'update:beneficiario',
    'update:cuentaDestino',
    'update:concepto',
    'update:metodoRetiro',
  ],

  props: {
    monto: {
      type: [String, Number],
      default: '',
    },
    beneficiario: {
      type: String,
      default: '',
    },
    cuentaDestino: {
      type: String,
      default: '',
    },
    concepto: {
      type: String,
      default: 'Pago por reserva de hospedaje',
    },
    metodoRetiro: {
      type: String,
      default: 'Cuenta bancaria',
    },
    metodosRetiro: {
      type: Array,
      default: () => ['Cuenta bancaria / Yape / Plin'],
    },
    formularioValido: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.retiro-form {
  flex: 1;
}

.retiro-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--payflow-header);
  margin-bottom: 16px;
}

.retiro-btns {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
}

.retiro-btn-cancelar {
  flex: 1;
}

.retiro-btn-continuar {
  flex: 1;
}
</style>
