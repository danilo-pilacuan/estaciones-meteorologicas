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
      { path: 'users', component: () => import('pages/UsersPage.vue')
        ,meta: { requiresAuth: true },
      },
      { path: 'stations', component: () => import('pages/StationsPage.vue')
        ,meta: { requiresAuth: true },
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
