import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

import { useAuthStore } from 'src/stores/auth-store';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.VUE_APP_AXIOS_URL || '' });

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Obtén la instancia del store de autenticación
    const token = authStore.getJWT; // Obtén el JWT del store

    console.log('token -----------------------');
    console.log('token -----------------------');
    console.log('token -----------------------');
    console.log('token -----------------------');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header Authorization
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
