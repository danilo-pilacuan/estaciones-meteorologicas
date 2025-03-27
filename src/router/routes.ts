import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'visor', component: () => import('pages/VisorPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'usuarios', component: () => import('pages/UsersPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'estaciones', component: () => import('pages/StationsPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'informes', component: () => import('pages/ReportsPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'ayuda', component: () => import('pages/HelpPage.vue')
        ,meta: { requiresAuth: true },
      },
      {
        path: '/informe',
        name: 'informe',
        component: () => import('src/pages/ReportDetailPage.vue'),
      }
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),

    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') },
    //   { path: '/users', component: () => import('pages/UsersPage.vue') },
    // ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
