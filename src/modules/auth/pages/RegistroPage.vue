<template>
  <div>
    <div class="barra-azul barra-azul-flex">
      <q-btn
        label="VOLVER AL LOGIN"
        color="white"
        text-color="primary"
        flat
        class="volver-login-btn"
        @click="router.push({ name: 'login' })"
      />
    </div>

    <q-page class="q-pa-xl flex flex-center bg-grey-1">
      <div class="registro-container">
        <div class="registro-box">
          <div class="registro-title text-primary">Registro de Usuario</div>
          <div class="registro-desc">Complete sus datos para registro en la base de datos:</div>

          <div class="registro-form">
            <div class="registro-col">
              <q-input filled label="1. Nombres*" v-model="name" class="q-mb-md" />
              <q-input filled label="2. Apellidos*" v-model="lastname" class="q-mb-md" />
              <q-input filled label="3. Correo Electrónico*" v-model="email" class="q-mb-md" />
              <q-input filled label="4. Documento de Identidad*" v-model="dni" class="q-mb-md" />
              <q-input filled label="5. Usuario*" v-model="username" class="q-mb-md" />
            </div>

            <div class="registro-col">
              <q-input
                filled
                :type="showPassword ? 'text' : 'password'"
                label="6. Contraseña*"
                v-model="password"
                class="q-mb-md"
              />
              <q-input
                filled
                :type="showPassword ? 'text' : 'password'"
                label="7. Confirmar Contraseña*"
                v-model="confirmPassword"
                class="q-mb-md"
              />
              <q-checkbox v-model="showPassword" label="Mostrar Contraseña" class="q-mb-md" />
              <div class="registro-password-info">
                <q-icon name="warning" color="grey-7" size="md" class="q-mr-sm" />
                <span>
                  La contraseña debe cumplir con los siguientes criterios:<br />
                  - Al menos 8 caracteres<br />
                  - Al menos una letra mayúscula<br />
                  - Al menos un número
                </span>
              </div>
            </div>
          </div>

          <div class="registro-logo-box">
            <q-img
              src="/src/assets/logo-payflow.png"
              alt="Payflow Logo"
              style="width: 120px; height: 120px"
            />
          </div>

          <!-- Botón de registro -->
          <div class="registro-btns">
            <BtnPayflow label="REGISTRARSE" class="registro-btn" @click="register" />
          </div>

          <div class="registro-campos">*Campos mandatorios</div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { BtnPayflow } from 'src/components/atomos'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import 'src/css/payflow-figma.scss'

const name = ref('')
const lastname = ref('')
const email = ref('')
const dni = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const router = useRouter()

async function register() {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.')
    return
  }
  if (password.value.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres.')
    return
  }
  if (!/[A-Z]/.test(password.value)) {
    alert('La contraseña debe contener al menos una letra mayúscula.')
    return
  }
  if (!/[0-9]/.test(password.value)) {
    alert('La contraseña debe contener al menos un número.')
    return
  }
  try {
    const body = {
      idUsuario: 0,
      nombre: name.value,
      apellido: lastname.value,
      dni: dni.value,
      correo: email.value,
      usuario: username.value,
      contrasena: password.value,
      nuevaContrasena: null,
      fechaRegistro: new Date().toISOString(),
      estado: 'Activo',
    }
    await api.post('/Usuarios', body)
    alert('Usuario registrado correctamente.')
    router.push({ name: 'login' })
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al registrar usuario.'
    alert(msg)
  }
}
</script>

<style scoped>
.barra-azul {
  width: 100vw;
  height: 56px;
  background: #0a3d91;
}
.barra-azul-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.volver-login-btn {
  margin-right: 32px;
  margin-top: 8px;
  font-weight: bold;
  font-size: 1rem;
  background: transparent;
}
.registro-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.registro-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 24px 24px 24px;
  max-width: 900px;
  width: 100%;
}
.registro-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: center;
}
.registro-desc {
  font-size: 1.1rem;
  margin-bottom: 24px;
  text-align: center;
}
.registro-form {
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 16px;
}
.registro-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.registro-logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0 16px 0;
  gap: 16px;
}
.registro-btns {
  display: flex;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: 8px;
}
.registro-btn {
  width: 220px;
  font-size: 1.2rem;
  font-weight: bold;
}
.registro-campos {
  font-size: 0.9rem;
  color: #888;
  margin-top: 8px;
  text-align: center;
}
.registro-password-info {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 0.95rem;
  color: #444;
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}
</style>
