<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px">
      <q-card-section>
        <div class="text-h5 text-primary text-center">Inicio de Sesión</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="email" filled label="Correo" />
        <q-input v-model="password" type="password" filled label="Contraseña" class="q-mt-md" />
        <q-btn label="Iniciar Sesión" color="primary" class="q-mt-lg full-width" @click="login" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/store'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

function login() {
  // Simula login con cualquier credencial
  auth.loginSimulado(email.value)
  router.push({ name: 'home' })
}
</script>
