<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Consola de Visualización Meteorológica
        </q-toolbar-title>

          <q-btn flat dense icon-right="account_circle" :label="(authStore.user ? '('+authStore.user.nombre +')'+ ' ' : '') + 'Cerrar Sesión'"
          aria-label="Cerrar sesión"
          class="q-mx-md"
          @click="cerrarSesion" />

      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Opciones
        </q-item-label>
        <div v-for="link in essentialLinks" :key="link.title">
          <EssentialLink v-bind="link"  v-if="link.visible" />
        </div>

      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';


const router = useRouter()
const authStore = useAuthStore(); // Obtén la instancia del store de autenticación

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Inicio',
    caption: 'Página de inicio del sistema',
    icon: 'home',
    link: '/',
    visible:true
  },
  {
    title: 'Visor',
    caption: 'Permite visualizar los valores meteorológicos de las estaciones registradas',
    icon: 'travel_explore',
    link: '/visor',
    visible:true
  },
  {
    title: 'Estaciones',
    caption: 'Permite administrar las estaciones de la red',
    icon: 'satellite_alt',
    link: '/stations',
    visible:authStore.user?.rol.id === 1
  },
  {
    title: 'Usuarios',
    caption: 'Permite administrar los usuarios del sistema',
    icon: 'people',
    link: '/users',
    visible:authStore.user?.rol.id === 1
  },
  {
    title: 'Ayuda',
    caption: 'Información de uso del sistema',
    icon: 'help',
    link: '/help',
    visible:true
  }
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

//Methods

const cerrarSesion = () => {
  console.log('cerrar sesion')
  authStore.logout()
  router.push('/login');
}
// const mostrarNotificaciones = () => {
//   console.log('mostrar notificaciones')
// }

</script>
