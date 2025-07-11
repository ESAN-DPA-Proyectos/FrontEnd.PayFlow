<template>
  <q-page class="q-pa-xl">
    <div class="text-h5">Realizar Depósito</div>

    <q-form class="q-mt-md" @submit.prevent="handleSubmit">
      <!-- Monto -->
      <q-input
        v-model="form.monto"
        label="Monto (S/)"
        type="number"
        filled
        class="q-mb-md"
        style="max-width: 300px"
        :rules="[(val) => val > 0 || 'Ingrese un monto válido']"
        required
      />

      <!-- Método de pago -->
      <q-select
        v-model="form.metodoPago"
        label="Método de Pago"
        :options="metodosPago"
        filled
        class="q-mb-md"
        style="max-width: 300px"
        :rules="[(val) => !!val || 'Seleccione un método de pago']"
        required
      />

      <!-- Referencia -->
      <q-input
        v-model="form.referencia"
        label="Referencia del voucher"
        filled
        class="q-mb-md"
        style="max-width: 300px"
        :rules="[(val) => !!val || 'Ingrese la referencia del voucher']"
        required
      />

      <!-- Concepto -->
      <q-input
        v-model="form.concepto"
        label="Concepto del depósito"
        filled
        class="q-mb-md"
        style="max-width: 300px"
        :rules="[(val) => !!val || 'Ingrese un concepto']"
        required
      />

      <!-- Comprobante (sin vista previa) -->
      <q-file
        v-model="archivo"
        label="Subir imagen del voucher"
        filled
        accept=".jpg, .jpeg, .png"
        class="q-mb-md"
        style="max-width: 400px"
        :rules="[(val) => !!val || 'Debe subir un comprobante']"
        required
        use-chips
        counter
        no-thumbnails
      />

      <!-- Botón -->
      <q-btn type="submit" label="Confirmar Depósito" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

// Router
const router = useRouter()

// Formulario
const form = ref({
  monto: null,
  metodoPago: null,
  referencia: '',
  concepto: '',
})

// Archivo comprobante (q-file)
const archivo = ref(null)

// Métodos de pago
const metodosPago = ['Transferencia', 'Yape', 'Plin', 'Depósito Bancario']

// Enviar formulario
async function handleSubmit() {
  try {
    let imageUrl = ''

    // Subida del archivo si existe
    if (archivo.value) {
      const fd = new FormData()
      fd.append('file', archivo.value)

      const { data } = await axios.post(
        'http://localhost:5283/api/v1/Transactions/upload-comprobante',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )

      imageUrl = data.url
    }

    // Enviar datos de la transacción
    const payload = {
      tipo: 'Deposito',
      monto: form.value.monto,
      estado: 'Pendiente',
      metodoPago: form.value.metodoPago,
      referencia: form.value.referencia,
      concepto: form.value.concepto,
      comprobante: imageUrl,
      origenRol: 'Cliente',
    }

    await axios.post('http://localhost:5283/api/v1/Transactions', payload)

    // Redirigir a página de éxito con los datos enviados
    router.push({
      name: 'deposito-exito',
      query: {
        monto: form.value.monto,
        metodoPago: form.value.metodoPago,
        referencia: form.value.referencia,
        concepto: form.value.concepto,
        comprobante: imageUrl,
      },
    })
  } catch (err) {
    console.error('Error en el depósito:', err)
    Notify.create({
      type: 'negative',
      message: 'Ocurrió un error al procesar el depósito',
    })
  }
}
</script>
