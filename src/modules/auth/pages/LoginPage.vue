<template>
  <q-page class="flex flex-center payflow-page-bg">
    <q-card class="payflow-card-interactive q-pa-lg" style="width: 400px">
      <q-card-section>

        <div class="row flex-center q-mb-md">
          <q-img
            src="/src/assets/logo-payflow.png"
            alt="Payflow Logo"
            style="width: 128px; height: 128px"
          />
        </div>
        <h1 class="text-bold text-black text-center q-mb-sm" style="font-size: 1.625rem">
          ¡Bienvenido!
        </h1>
        
        <div class="payflow-section-title text-center">Inicio de Sesión</div>

      </q-card-section>

      <q-card-section>
        <q-input v-model="email" filled label="Correo" />
        <q-input v-model="password" type="password" filled label="Contraseña" class="q-mt-md" />
        <q-btn label="Iniciar Sesión" color="primary" class="q-mt-lg full-width" @click="login" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-center">
          <span>¿No tienes una cuenta?</span>
          <q-btn
            flat
            label="Regístrate"
            color="primary"
            class="q-ml-xs"
            @click="goToRegister"
            size="sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/modules/auth/store'
import axios from 'axios'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

async function login() {
  try {
    const response = await axios.post('http://localhost:5283/api/Usuarios/login', {
      usuario: email.value,
      contrasena: password.value,
    })
    // Muestra la respuesta completa para depuración
    console.log('Login response:', response.data)
    const { usuario } = response.data
    auth.login(usuario)
    router.push({ name: 'home' })
  } catch (error) {
    // Muestra el error real
    console.log('Login error:', error.response?.data || error)
    const msg = error.response?.data?.message || 'Credenciales incorrectas o error de conexión.'
    alert(msg)
  }
}

function goToRegister() {
  router.push({ name: 'registro' })
}
</script>
