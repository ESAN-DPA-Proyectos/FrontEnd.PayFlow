<template>
  <q-page class="q-pa-xl admin-page-payflow payflow-page-bg">
    <!-- Título fuera del card para mantener coherencia -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <div class="payflow-section-title">Validar Comprobantes</div>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card flat bordered class="payflow-card-interactive payflow-shadow">
          <q-card-section class="q-pa-lg">
            <div class="text-center">
              <q-icon
                name="verified"
                size="64px"
                color="primary"
                class="payflow-icon-shadow q-mb-md"
              />
              <div class="text-h6 text-bold q-mb-md" style="color: var(--payflow-primary)">
                Validación de Comprobantes
              </div>
              <div class="text-body1 text-grey-7">
                Esta funcionalidad está en desarrollo y estará disponible próximamente.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Página en desarrollo
</script>

<style lang="scss" scoped>
.admin-page-payflow {
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
}

.admin-page-payflow .payflow-section-title {
  display: block !important;
  visibility: visible !important;
  color: #0048bd !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important;
  z-index: 1;
}

@media (max-width: 1100px) {
  .admin-page-payflow .payflow-section-title {
    text-align: center !important;
  }
}
</style>
