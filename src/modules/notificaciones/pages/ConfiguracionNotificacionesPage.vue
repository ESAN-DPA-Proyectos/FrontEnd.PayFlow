<template>
  <div class="notificaciones-config q-pa-xl payflow-page-bg">
    <div class="row justify-center q-mt-xl">
      <q-card flat bordered class="tabla-notificaciones q-pa-xl">
        <div class="text-h6 text-primary q-mb-lg" style="font-size: 22px">
          PANEL DE CONFIGURACION (NOTIFICACIONES)
        </div>
        <div class="row q-col-gutter-xl q-mb-md">
          <div class="col-12">
            <q-form>
              <div class="row items-start">
                <div class="col-6">
                  <q-radio
                    v-model="opcion"
                    val="canales"
                    label="CANALES DE NOTIFICACION"
                    color="primary"
                  />
                  <div class="q-ml-xl q-mt-md" v-if="opcion === 'canales'">
                    <q-checkbox
                      v-model="canales.email"
                      label="NOTIFICACIONES POR CORREO ELECTRONICO."
                    />
                    <q-checkbox
                      v-model="canales.voz"
                      label="NOTIFICACIONES POR MENSAJE DE VOZ."
                      class="q-mt-md"
                    />
                    <q-checkbox
                      v-model="canales.sms"
                      label="NOTIFICACIONES POR SMS."
                      class="q-mt-md"
                    />
                  </div>
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
            </q-form>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const opcion = ref('canales')
const canales = ref({
  email: false,
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
.tabla-notificaciones {
  border-radius: 12px;
  width: 100%;
}
</style>
