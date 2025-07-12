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
        <q-input v-model="username" filled label="Nombre de Usuario" placeholder="Ej. jlopez2025" />
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
import { api } from 'boot/axios'

const username = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

async function login() {
  console.log('➡️  Iniciando intento de login')

  if (!username.value || !password.value) {
    alert('Por favor ingresa usuario y contraseña.')
    return
  }

  try {
    const { data } = await api.post('/api/Usuarios/login', {
      usuario: username.value,
      contrasena: password.value,
    })

    console.log('✅ Login exitoso:', data)

    const { usuario } = data
    console.log('🎯 Usuario recibido:', usuario)

    auth.login(usuario)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('❌ Error en login:', error)

    const msg =
      error.response?.data?.message ||
      (error.message.includes('Network')
        ? 'No se pudo conectar con el servidor.'
        : 'Credenciales incorrectas.')

    alert(msg)
  }
}

function goToRegister() {
  router.push({ name: 'register' })
}
</script>
