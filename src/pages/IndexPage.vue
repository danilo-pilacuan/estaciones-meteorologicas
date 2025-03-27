<template>
  <q-page class="q-pa-md">
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h5">Bienvenido a la Consola de Visualización Meteorológica</div>
      <!-- <div class="text-subtitle2">Resumen de los datos actuales:</div> -->
    </q-card-section>

    <q-separator />

    <!-- Nueva tarjeta para mostrar el número total de estaciones -->
    <q-card-section>
  <q-card flat bordered class="q-ma-sm shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
    <q-card-section class="text-center">
      <q-icon name="cloud" size="40px" class="q-mb-sm" /> <!-- Ícono de Quasar -->
      <div class="text-h6 font-bold">Estaciones Registradas</div>
      <div class="text-h4 font-extrabold q-mt-sm">{{ totalEstaciones }}</div> <!-- Mostrar el total -->
      <!-- <q-btn flat color="white" class="q-mt-sm" label="Ver detalles" /> Botón opcional -->
    </q-card-section>
    <q-separator dark />

    <q-card-actions align="center">
      <q-btn flat dense color="white" class="q-px-lg text-white q-btn__radius-none" icon="visibility" label="Ver detalles"
      @click="handleClickDetalles"/>
    </q-card-actions>
  </q-card>
</q-card-section>

    <!-- <q-separator /> -->

    <!-- Mostrar las estaciones dinámicamente -->
    <!-- <q-card-section>
      <div class="q-gutter-md">
        <q-card v-for="estacion in estacionesData" :key="estacion.id" :class="getCardClass(estacion)">
          <q-card-section>
            <div class="text-h6">{{ estacion.numero_serie }}</div>
            <div>Latitud: {{ estacion.latitud }}</div>
            <div>Longitud: {{ estacion.longitud }}</div>
            <div>Última medición: {{ getLastMedicion('1', estacion) }}</div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-3">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Modelo</q-item-label>
                    <q-item-label caption>{{ estacion.modelo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-3">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Descripción</q-item-label>
                    <q-item-label caption>{{ estacion.descripcion }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-3">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Ubicación</q-item-label>
                    <q-item-label caption>
                      Lat: {{ estacion.latitud }} | Lon: {{ estacion.longitud }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-3">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Estado</q-item-label>
                    <q-item-label>
                      <q-badge :color="getEstadoColor(estacion.estado)">
                        {{ getEstadoTexto(estacion.estado) }}
                      </q-badge>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section> -->
  </q-card>
</q-page>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; // Añadimos computed
import { api } from 'src/boot/axios';
import { TEstacion } from 'src/components/models'
import { useRouter } from 'vue-router';

const router = useRouter();

const estacionesData = ref<TEstacion[]>([]);
const totalEstaciones = computed(() => estacionesData.value.length); // Calcula el número total
const medicionesEstacion = ref<any[]>([]); // Array de mediciones de las estaciones
const lastUpdateDate = ref('7 de marzo de 2025'); // Fecha de última actualización


const handleClickDetalles = () => {
  console.log('Ver detalles');

  router.push('/visor');
};

// Función para obtener las estaciones desde la API
const fetchEstaciones = async () => {
  try {
    const response = await api.get('/estacion');
    estacionesData.value = response.data as TEstacion[];
    // Luego de cargar las estaciones, obtenemos las mediciones para cada estación
    estacionesData.value.forEach((estacion) => {
      fetchMediciones(estacion.numero_serie);
    });
  } catch (error) {
    console.error('Error fetching estaciones', error);
  }
};

// Función para obtener la última medición de cada estación
const fetchMediciones = async (numeroSerie: string) => {
  try {
    const response = await api.get(`/medicion/getbyestacionytipo/${numeroSerie}?tipo=1&limit=1`);
    const medicion = response.data.data[0]; // Obtener solo la última medición (limit=1)
    medicionesEstacion.value.push({
      numeroSerie,
      medicion
    });
  } catch (error) {
    console.error(`Error fetching mediciones for station ${numeroSerie}`, error);
  }
};

// Función para obtener la última medición (created_at) de una estación
const getLastMedicion = (tipo: string, estacion: TEstacion) => {
  const mediciones = medicionesEstacion.value.find((item) => item.numeroSerie === estacion.numero_serie);
  if (mediciones) {
    // Retornamos solo el campo `created_at` de la última medición
    return mediciones.medicion ? mediciones.medicion.created_at : 'No disponible';
  }
  return 'No disponible';
};

// Función para obtener el color de fondo de la tarjeta dependiendo de la estación
const getCardClass = (estacion: TEstacion) => {
  return estacion.estado === 1 ? 'bg-blue-2' : estacion.estado === 2 ? 'bg-green-2' : 'bg-yellow-2';
};

// Función para obtener el color del estado
const getEstadoColor = (estado: number) => {
  switch (estado) {
    case 1:
      return 'green';
    case 2:
      return 'yellow';
    case 3:
      return 'red';
    default:
      return 'grey';
  }
};

// Función para obtener el texto del estado
const getEstadoTexto = (estado: number) => {
  switch (estado) {
    case 1:
      return 'Activo';
    case 2:
      return 'Inactivo';
    case 3:
      return 'Error';
    default:
      return 'Desconocido';
  }
};

// Llamar a la función para cargar las estaciones y mediciones al montar el componente
onMounted(() => {
  fetchEstaciones();
});

// Función para manejar la acción de ver detalles
const viewDetails = () => {
  console.log('Ver más detalles');
};
</script>

<style scoped>
.q-pa-md {
  padding: 16px;
}

.q-gutter-md {
  margin-bottom: 16px;
}

#temperatureChart {
  max-width: 100%;
  height: 300px;
}

.q-card {
  margin-bottom: 16px;
}

.q-banner {
  margin-bottom: 16px;
}

.bg-blue-2 {
  background-color: #e3f2fd;
}

.bg-green-2 {
  background-color: #c8e6c9;
}

.bg-yellow-2 {
  background-color: #fff9c4;
}

.shadow-lg {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.bg-gradient-to-r {
  background: linear-gradient(to right, #2196F3, #673AB7);
}

.font-extrabold {
  font-weight: 800;
}

.q-mb-sm {
  margin-bottom: 8px;
}
</style>
