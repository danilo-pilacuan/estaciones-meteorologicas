<template>
  <div class="container q-pa-lg">
    <div class="row justify-center">
      <div class="col-10">
        <!-- Instrucciones -->
        <div class="instructions-box q-mb-md">
          📍 <strong>Interacción con el mapa:</strong> Seleccione un marcador para ver la información detallada de la estación meteorológica.
        </div>

        <ol-map ref="map" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true"
          style="height: 600px; width: 100%;">

          <ol-view :center="center" :zoom="zoom" :projection="projection" ref="view" :maxZoom="18" /> <!-- Limitar el zoom máximo -->

          <ol-tile-layer>
            <ol-source-osm />
          </ol-tile-layer>

          <ol-interaction-select
            @select="featureSelected"
            :condition="selectCondition"
            :filter="selectInteactionFilter"
          >
            <ol-style>

              <!-- <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill> -->
              <ol-style-circle :radius="10">
                <ol-style-fill color="red"></ol-style-fill>
              </ol-style-circle>
            </ol-style>
          </ol-interaction-select>


          <ol-vector-layer>
            <ol-source-vector ref="markers"
              :features="estacionesFeatures"
              :format="geoJson"
              :projection="projection"
            > </ol-source-vector>
            <!-- <ol-source-vector
              ref="cities"
              url="https://raw.githubusercontent.com/alpers/Turkey-Maps-GeoJSON/master/tr-cities-airports.json"
              :format="geoJson"
              :projection="projection"
            >
            </ol-source-vector> -->
            <ol-style>

              <ol-style-circle :radius="10">
                <ol-style-fill color="blue"></ol-style-fill>
              </ol-style-circle>
            </ol-style>
          </ol-vector-layer>



        </ol-map>
      </div>
    </div>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card class="q-pa-md" style="width: 90vw; height: 90vh; max-width: 90vw; max-height: 90vh;">
      <!-- Título -->
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
           Estación Seleccionada: {{ estacionSelected?.numero_serie }}
        </div>
      </q-card-section>
      <q-separator />
      <!-- Propiedades en formato compacto -->
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-3">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Modelo</q-item-label>
                <q-item-label caption>{{ estacionSelected?.modelo }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-3">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Descripción</q-item-label>
                <q-item-label caption>{{ estacionSelected?.descripcion }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-3">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Ubicación</q-item-label>
                <q-item-label caption>
                  Lat: {{ estacionSelected?.latitud }} | Lon: {{ estacionSelected?.longitud }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col-3">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold">Estado</q-item-label>
                <q-item-label>
                  <q-badge :color="getEstadoColor(estacionSelected?.estado)">
                    {{ getEstadoTexto(estacionSelected?.estado) }}
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
      <q-separator />

<!-- Selector de Variable Destacado -->
<q-card-section class="q-mb-md">
  <div class="text-subtitle1 text-weight-bold q-mb-sm">📊 Seleccionar Variable:</div>
  <q-select
    v-model="selectedVariable"
    :options="variablesSelectArray"
    label="Elija una opción"
    filled
    dense
    emit-value
    map-options
    @update:model-value="consultarMediciones"
  />
</q-card-section>

<q-separator />
      <!-- Tabla de datos aleatorios -->
      <q-card-section>
        <q-table
        v-if="medicionesEstacion && medicionesEstacion.length > 0"
        :rows="medicionesEstacion"
        :columns="columnas"
        row-key="id"
        dense
        separator="horizontal"
        flat
        :rows-per-page-options="[20, 30, 40]"

      >
      <template v-slot:body-cell-unidad="props">
        <td>{{ props.row.tipo_medicion?.unidad?props.row.tipo_medicion.unidad.descripcion:"U"}}</td>
      </template>
        <template v-slot:top>
          <div v-if="medicionesEstacion.length === 0" class="q-pa-md text-center">
            <q-banner>
              <q-icon name="info" />
              <span>Primero seleccione la variable de la cual visualizar los datos</span>
            </q-banner>
          </div>
        </template>
      </q-table>
      </q-card-section>

      <q-card-section style="height: 40vh; overflow: hidden;" v-if="medicionesEstacion && chartData && chartOptions && medicionesEstacion.length > 0">
        <LineChart :chartData="chartData" :chartOptions="chartOptions" v-if="medicionesEstacion && chartData && chartOptions && medicionesEstacion.length > 0"/>
      </q-card-section>

      <q-separator />


      <!-- Botón de cerrar -->
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup  @click="()=>{
          dialogVisible = false

        }" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted,inject, computed, watch } from 'vue';
import { api } from 'src/boot/axios';

import mypoints from 'src/assets/mypoints.json';

import type { ContextMenuEvent, Item } from 'ol-contextmenu';

import { Feature, type View } from 'ol';
import { Geometry, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { TEstacion } from 'src/components/models';

import LineChart from 'src/components/LineChart.vue' // Ajusta la ruta según tu estructura


export interface TPatientInput {
  _id: string;
  name: string;
  lastname: string;
  birthdate: string;
  contactInfo: string;
  idNumber: string;
  deviceId: string;
  createdAt: Date;
}

 const estacionSelected = ref<TEstacion|null>(
//{
//   id: 0,
//   numero_serie: "string",
//   modelo: "string",
//   descripcion: "string",
//   latitud: "string",
//   longitud: "string",
//   variablesSelectArray: "string",
//   estado: "string",
//   informacion_adicional: "string",
//   created_at: new Date(),
//   updated_at: new Date()
// }
)

// Opciones del select
const variablesSelectArray = ref([
  { label:"Velocidad Viento",value:1},
  { label:"Radiación",value:2},
  { label:"Humedad Relativa",value:3},
  { label:"Presión",value:4},
  { label:"Temperatura",value:5},
  { label:"Altitud",value:6},
  { label:"Calidad Aire",value:7}
]);

const selectedVariable = ref(null);
const inputValue = ref('');

const showDialog = ref(false);

const dialogVisible = ref(false);

const showLinkDialog = ref(false);


const isEditing = ref(false);
const isUnlinking = ref(false);
const isEditingZone = ref(false);

const showSetSecureZone = ref(false);

const columnas = [
  //{ name: "id", label: "ID", field: "id", align: "left" as const },
  { name: "fecha", label: "Fecha Medición", field: "created_at", align: "right" as const },
  { name: "valor", label: "Valor", field: "valor", align: "right" as const },
  { name: "unidad", label: "Unidad", field: "unidad", align: "right" as const },
];

// Datos aleatorios (simulación)
interface Medicion {
  id: number;
  created_at: string;
  valor: number;
  unidad: string;
}

const medicionesEstacion = ref<Medicion[]>([]);


const getEstadoTexto = (estado:any) => {
  switch (estado) {
    case 1: return "Activa";
    case 2: return "Inactiva";
    case 3: return "En Mantenimiento";
    default: return "Desconocido";
  }
};

// Función para obtener el color del estado
const getEstadoColor = (estado:any) => {
  switch (estado) {
    case 1: return "green";
    case 2: return "red";
    case 3: return "orange";
    default: return "grey";
  }
};
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const selectDevice = (device: any) => {
//   device.label = device.phoneNumber;
//   selectedDevice.value = device

// };
////////////////////////
const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Fecha'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valor'
      }
    }
  }
})

const medicionesEstacion2 = ref<{ fecha: string, valor: number }[]>([])

// Función para consultar mediciones (simulación)
const consultarMediciones2 = () => {
  // Aquí se deben obtener los datos del backend según la variable seleccionada
  // Ejemplo de datos:
  medicionesEstacion2.value = [
    { fecha: '2025-01-01', valor: 30 },
    { fecha: '2025-01-01', valor: 30 },
    { fecha: '2025-01-01', valor: 30 },
    { fecha: '2025-01-02', valor: 25 },
    { fecha: '2025-01-03', valor: 35 },
    { fecha: '2025-01-03', valor: 34 },
    { fecha: '2025-01-03', valor: 95 },
  ]
}

// Actualiza los datos del gráfico en función de las mediciones obtenidas
const actualizarGrafico = () => {
  //consultarMediciones2()
  console.log("medicionesEstacion.value ++++++++++++++")
  console.log(medicionesEstacion.value)

  chartData.value.labels = medicionesEstacion.value.map(m => m.created_at);
  chartData.value.datasets[0].data = medicionesEstacion.value ? medicionesEstacion.value.map(m => m.valor) : [];

  console.log("chartData.value.labels !!!!!!!!!!")


  // chartData.value.datasets[0].label =variablesSelectArray[selectedVariable-1].label;

  // console.log("actualizarGrafico")
  // console.log("actualizarGrafico")
  // console.log("actualizarGrafico")
  // console.log("chartData.value.labels >>>>>>>>>>>>>>>>>>>>>>>")
  // console.log(chartData.value.labels)
  // console.log("chartData.value.datasets[0].data <<<<<<<<<<<<<<<<<<<")
  // console.log(chartData.value.datasets[0].data)
  // console.error("actualizarGrafico")
  // console.warn("actualizarGrafico")
  // console.log("actualizarGrafico")


}



////////////////////////


const format = inject("ol-format");

const geoJson = new format.GeoJSON();

const selectConditions = inject("ol-selectconditions");

const selectCondition = selectConditions.singleClick;;

const featureSelected = (event:any) => {
  console.log("featureSelected "+Math.random());
  const selectedFeature = event.selected[0]; // Tomar el primer feature seleccionado

  if (selectedFeature) {
    console.log("Feature seleccionado:", selectedFeature.get("name"));
    dialogVisible.value=true
    estacionSelected.value = estacionesData.value.find((estacion) => estacion.numero_serie === selectedFeature.get("name"));
  }
  else
  {
  estacionSelected.value=null;
  }
};

const selectInteactionFilter = (feature:any) => {
  return feature.values_.name != undefined;
};

const contextMenuItems = ref<Item[]>([]);
const center = ref([-78.504804,-0.197954]);
const circleCenter = ref([0, 0]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const markers = ref<{ source: VectorSource } | null>(null);

const estacionesData = ref<TEstacion[]>([]);

const view = ref<View | null>(null);



const markersLength = ref(0);

const estacionesFeatures = ref<Feature<Geometry>[]>([]);


function log(type: string, event: ContextMenuEvent) {
  console.log(type, event);
}

////////////////////////


const updateInputValue = (value: string) => {

  console.log('updateeeeeevalueee... ', value)
  inputValue.value = 'value.imei;'
  console.log('inputValue.value')
  console.log(value)

};

const consultarMediciones=()=>{
  console.log('consultarMediciones...')
  console.log('selectedVariable.value')
  console.log(selectedVariable.value)
  console.log('selectedVariable.label')
  console.log(selectedVariable.label)
  if(estacionSelected.value){
    api.get(`/medicion/getbyestacionytipo/${estacionSelected.value?.numero_serie}?tipo=${selectedVariable.value}`).then((response) => {
      console.log('Mediciones loaded:', response.data);
      medicionesEstacion.value = response.data.data;

      actualizarGrafico()

    }).catch(() => {
      console.log('Error loading mediciones');
    });
  }
}

const loadEstaciones = () => {
  console.log('Loading estaciones...');
  api.get('/estacion').then((response) => {
    console.log('Users loaded:', response.data);

    estacionesData.value = response.data as TEstacion[];
    console.log("estacionesData.value")
    console.log(estacionesData.value)


    const featuresArray=estacionesData.value.map((estacion)=>{
    return {
      "type":"Feature",
      "properties":{
         "name":estacion.numero_serie,
         "number":estacion.id
      },
      geometry: {
        type: "Point",
        coordinates: [estacion.longitud,estacion.latitud],
      },
    }
  });

  estacionesFeatures.value=geoJson.readFeatures({
    type: "FeatureCollection",
    features: featuresArray,
  });

  console.log("estacionesFeatures.value")
  console.log(estacionesFeatures.value)

  }).catch(() => {
    console.log('Error loading users');
  });
};

onMounted(() => {
  loadEstaciones();
});




</script>


<script lang='ts'>
export default {
  name: 'PatientsComponent',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-table {
  flex: 1;
}

.q-toolbar-title {
  flex: 1;
}

.item-border {
  border-bottom: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
}

.map-picker {
  position: relative;
}

.coordinates {
  margin-top: 10px;
}

.marker {
  background-color: #00000000;
  padding: 10px;
  border-radius: 25px;
  margin: 5px;
  font-size: 90px;
}
</style>
