<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Header con estilo de gradiente y más espaciado -->
    <q-header elevated class="bg-gradient-to-r text-white shadow-md">
      <q-toolbar class="bg-gradient-to-r text-white">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-h5 q-pl-md">
          Consola de Visualización Meteorológica
        </q-toolbar-title>

        <q-btn
          flat
          dense
          icon-right="account_circle"
          :label="(authStore.user ? '('+authStore.user.nombre +')'+ ' ' : '') + 'Cerrar Sesión'"
          aria-label="Cerrar sesión"
          class="q-mx-md text-white"
          @click="cerrarSesion"
        />
      </q-toolbar>
    </q-header>

    <!-- Drawer mejorado con íconos y separación -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-list padding>
        <q-item-label header class="text-grey-9 q-mt-sm">
          Opciones del Sistema
        </q-item-label>
        <q-separator spaced />

        <div v-for="link in essentialLinks" :key="link.title">
          <EssentialLink v-bind="link" v-if="link.visible" />
        </div>
      </q-list>
    </q-drawer>

    <!-- Contenedor de la página -->
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore(); // Obtén la instancia del store de autenticación

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Inicio',
    caption: 'Página de inicio del sistema',
    icon: 'home',
    link: '/',
    visible: true
  },
  {
    title: 'Visor',
    caption: 'Permite visualizar los valores meteorológicos de las estaciones registradas',
    icon: 'travel_explore',
    link: '/visor',
    visible: true
  },
  {
    title: 'Informes',
    caption: 'Visualizar informes diarios',
    icon: 'summarize',
    link: '/informes',
    visible: true
  },
  {
    title: 'Estaciones',
    caption: 'Permite administrar las estaciones de la red',
    icon: 'satellite_alt',
    link: '/estaciones',
    visible: authStore.user?.rol.id === 1
  },
  {
    title: 'Usuarios',
    caption: 'Permite administrar los usuarios del sistema',
    icon: 'people',
    link: '/usuarios',
    visible: authStore.user?.rol.id === 1
  },
  {
    title: 'Ayuda',
    caption: 'Información de uso del sistema',
    icon: 'help',
    link: '/ayuda',
    visible: true
  }
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const cerrarSesion = () => {
  console.log('cerrar sesion');
  authStore.logout();
  router.push('/login');
};
</script>
<style>
.bg-gradient-to-r {
  background: linear-gradient(to left, #2196F3, #673AB7);
}

</style>
