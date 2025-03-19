import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

import { useAuthStore } from 'src/stores/auth-store';
import { api } from 'src/boot/axios'; // Importa la instancia de Axios

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(); // Obtén el store de autenticación
    console.log('authStore.getJWT');
    console.log('authStore.getJWT: ' + authStore.getJWT);
    console.log('authStore.getJWT');

    console.log('to.meta.requiresAuth :' + to.meta);
    console.log(to.meta);

    if (to.meta.requiresAuth) {
      // Si la ruta requiere autenticación y el usuario no está autenticado o el token ha expirado
      //authStore.clearToken(); // Limpia el token por si acaso

      try {
        // Por ejemplo, podrías verificar si el token sigue siendo válido
        const response = await api.post('/auth/validate-session');
        console.log('response');
        console.log('response');
        console.log('response');
        console.log('response');
        console.log(response);
        if (response.status === 200) {
          console.log('status okkkkk');
          next(); // El token es válido, permite la navegación
        } else {
          console.log('status not okkkkk');
          authStore.logout(); // Token inválido, cierra sesión
          next('/login'); // Redirige a la página de login
        }
      } catch (error) {
        console.error('Error validating token:', error);
        authStore.logout(); // Cierra sesión en caso de error
        next('/login'); // Redirige a la página de login
      }
    } else {
      next(); // Continúa la navegación normalmente
    }
  });

  return Router;
});
