<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px">
      <q-card-section>
        <div class="text-bold text-black text-center" style="font-size: 1.25rem">
          Bienvenida Usuario
        </div>
        <div class="text-h5 text-primary text-center">Registro</div>
      </q-card-section>

      <q-card-section>
        <q-input filled label="Nombre" v-model="name" />
        <q-input filled label="Correo" v-model="email" />
        <q-input filled type="password" label="Contraseña" class="q-mt-md" v-model="password" />
        <q-btn label="Registrarse" color="primary" class="q-mt-lg full-width" @click="register" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/modules/auth/store'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

function register() {
  // Simula registro e inicio de sesión
  const fakeToken = 'FAKE_TOKEN'
  const fakeUser = { name: name.value, email: email.value }

  auth.login(fakeToken, fakeUser)
  router.push({ name: 'home' })
}
</script>
