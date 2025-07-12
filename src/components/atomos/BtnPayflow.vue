<template>
  <q-btn
    v-bind="$attrs"
    :class="['btn-payflow', $attrs.class]"
    :label="label"
    :icon="icon"
    :type="type"
    :disable="disable"
    :loading="loading"
    :flat="flat"
    :outline="outline"
    :rounded="rounded"
    :dense="dense"
    :size="size"
    @click="$emit('click', $event)"
  />
</template>

<script setup>
// Props principales de q-btn, puedes extender según necesidad
// Usar defineProps sin asignar a variable para evitar warning de ESLint

defineProps({
  label: String,
  icon: String,
  type: { type: String, default: 'button' },
  disable: Boolean,
  loading: Boolean,
  flat: Boolean,
  outline: Boolean,
  rounded: Boolean,
  dense: Boolean,
  size: String,
})
</script>

<style scoped>
.btn-payflow {
  background: #004b8d !important;
  color: #fff !important;
  font-weight: 500;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  transition: background 0.2s;
}
.btn-payflow:hover,
.btn-payflow:focus {
  background: #00396b !important;
  color: #fff !important;
}
</style>
