<template>
  <q-page class="payflow-success-page q-pa-md bg-grey-1" style="min-height: calc(100vh - 120px)">
    <div class="row justify-center q-pt-lg">
      <div class="column items-center" style="width: 100%; max-width: 600px">
        <div class="payflow-section-title q-mb-xl q-mt-md">Confirmar Solicitud de Retiro</div>
        <q-card
          flat
          bordered
          class="payflow-card-interactive q-pa-lg shadow-2"
          style="max-width: 480px; width: 100%"
          >>
          <q-card-section>
            <div class="text-subtitle1 text-bold">Resumen de la operación</div>
            <div class="q-mb-md">Verifica los detalles antes de confirmar</div>
            <q-separator />
            <div class="row q-mt-md">
              <div class="col-6 text-left text-grey-8">Monto a retirar</div>
              <div class="col-6 text-right">S/ {{ $route.query.monto }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Método de retiro</div>
              <div class="col-6 text-right">{{ $route.query.metodo }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Destino</div>
              <div class="col-6 text-right">{{ $route.query.cuenta }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-left text-grey-8">Concepto</div>
              <div class="col-6 text-right">{{ $route.query.concepto }}</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-bold q-mb-md">
              Tu solicitud de retiro será revisada por un administrador y procesada en un plazo
              máximo de 24 horas.
            </div>
            <div class="row q-col-gutter-md flex flex-center">
              <div class="col-auto">
                <BtnPayflow label="Cancelar" flat @click="cancelar" />
              </div>
              <div class="col-auto">
                <BtnPayflow label="Confirmar solicitud de retiro" @click="confirmar" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { BtnPayflow } from 'src/components/atomos'
const router = useRouter()
function cancelar() {
  router.push({ name: 'retiro' })
}
function confirmar() {
  router.push({ name: 'retiro-exito' })
}
</script>

<style scoped>
@media (max-width: 600px) {
  .q-card {
    margin: 0 16px;
    max-width: calc(100vw - 32px) !important;
  }
}
</style>
