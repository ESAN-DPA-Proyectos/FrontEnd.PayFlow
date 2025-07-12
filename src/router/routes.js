const routes = [
  // Rutas públicas bajo AuthLayout
  {
    path: '/auth',
    component: () => import('src/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/modules/auth/pages/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('src/modules/auth/pages/RegistroPage.vue'),
      },
    ],
  },

  // Ruta temporal para testing del historial (sin autenticación)
  {
    path: '/test-historial',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'test-historial',
        component: () => import('src/modules/historial/pages/HistorialPage.vue'),
      },
    ],
  },

  // Rutas protegidas bajo MainLayout
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/modules/home/pages/IndexPage.vue'),
      },
      {
        path: 'deposito',
        name: 'deposito',
        component: () => import('src/modules/deposito/pages/DepositoPage.vue'),
      },
      {
        path: 'retiro',
        name: 'retiro',
        component: () => import('src/modules/retiro/pages/RetiroPage.vue'),
      },
      {
        path: 'retiro/confirmacionretiro',
        name: 'retiro-confirmar',
        component: () => import('src/modules/retiro/pages/ConfirmacionRetiroPage.vue'),
      },
      {
        path: 'retiro/retiroexito',
        name: 'retiro-exito',
        component: () => import('src/modules/retiro/pages/RetiroExitoPage.vue'),
      },
      {
        path: 'historial',
        name: 'historial',
        component: () => import('src/modules/historial/pages/HistorialPage.vue'),
      },
      {
        path: 'historial/detalle/:id',
        name: 'detalle-transaccion',
        component: () => import('src/modules/historial/pages/DetalleTransaccionPage.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('src/modules/admin/pages/ValidarComprobantesPage.vue'),
      },
      {
        path: 'admin/fondos',
        name: 'admin-fondos',
        component: () => import('src/modules/admin/pages/AdminFondosPage.vue'),
      },
      {
        path: 'mantenimiento',
        name: 'mantenimiento',
        component: () => import('src/modules/admin/pages/ValidacionAutomaticaPage.vue'),
      },
      {
        path: 'reportes',
        name: 'reportes',
        component: () => import('src/modules/reportes/pages/ValidacionReportesPage.vue'),
      },
      {
        path: 'notificaciones',
        name: 'notificaciones',
        component: () =>
          import('src/modules/notificaciones/pages/ConfiguracionNotificacionesPage.vue'),
      },
      {
        path: 'logout',
        name: 'logout',
        component: () => import('src/modules/auth/pages/LogoutPage.vue'),
      },
    ],
  },

  // Ruta desconocida (404)
  {
    path: '/:catchAll(.*)*',
    name: 'error404',
    component: () => import('src/modules/common/pages/ErrorNotFound.vue'),
  },
]

export default routes
