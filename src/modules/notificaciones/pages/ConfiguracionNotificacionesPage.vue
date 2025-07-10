<template>
  <div class="notificaciones-config q-pa-xl">
    <div class="titulo q-mb-lg">PANEL DE CONFIGURACION (NOTIFICACIONES)</div>
    <div class="row justify-center">
      <q-card flat bordered class="opciones-card q-pa-xl">
        <div class="row q-col-gutter-xl q-mb-md">
          <div class="col-6 flex items-center">
            <q-radio
              v-model="opcion"
              val="canales"
              label="CANALES DE NOTIFICACION"
              color="primary"
            />
          </div>
          <div class="col-6 flex items-center">
            <q-radio
              v-model="opcion"
              val="ninguna"
              label="NO RECIBIR NOTIFICACIONES."
              color="primary"
            />
          </div>
        </div>
        <div v-if="opcion === 'canales'" class="q-ml-md">
          <q-checkbox
            v-model="canales.correo"
            label="NOTIFICACIONES POR CORREO ELECTRONICO."
            color="primary"
          />
          <q-checkbox
            v-model="canales.voz"
            label="NOTIFICACIONES POR MENSAJE DE VOZ."
            color="primary"
          />
          <q-checkbox v-model="canales.sms" label="NOTIFICACIONES POR SMS." color="primary" />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const opcion = ref('canales')
const canales = ref({
  correo: false,
  voz: false,
  sms: false,
})
</script>

<style scoped>
.notificaciones-config {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
}
.titulo {
  color: #175a8e;
  font-size: 1.35rem;
  font-weight: 500;
  margin-bottom: 24px;
  margin-left: 8px;
  text-align: left;
}
.opciones-card {
  border-radius: 12px;
  min-height: 250px;
  max-width: 900px;
  width: 100%;
}
.q-radio,
.q-checkbox {
  margin-bottom: 18px;
}
</style>
