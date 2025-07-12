<template>
  <q-page class="q-pa-xl flex flex-center payflow-page-bg">
    <q-card class="q-pa-lg text-center">
      <q-icon name="lock" size="64px" color="grey-8" />
      <div class="text-h6 q-mt-md">Sesión cerrada</div>
      <div class="text-subtitle2 text-grey">Gracias por usar PayFlow</div>
      <div class="q-pa-md flex flex-center">
        <BtnPayflow label="Volver al login" class="q-mt-md" @click="volverAlLogin" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'src/modules/auth/store'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { BtnPayflow } from 'src/components/atomos'

const auth = useAuthStore()
const router = useRouter()

// Cierra la sesión apenas se carga la página
onMounted(() => {
  auth.logout()
})

function volverAlLogin() {
  router.push({ name: 'login' })
}
</script>
