<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row justify-center">
      <div class="column items-center" style="width: 100%">
        <div class="text-h5 q-mb-lg q-mt-xl">Confirmar Solicitud de Retiro</div>
        <q-card flat bordered class="q-pa-lg" style="max-width: 420px; width: 100%">
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
