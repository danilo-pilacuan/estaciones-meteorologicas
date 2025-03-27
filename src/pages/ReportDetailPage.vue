<template>
  <div>
    <!-- <div>
      <h1>Detalle del Informe</h1>
      <p>ID del informe: {{ estacion }}</p>
      <p>Fecha de inicio: {{ fechaInicio }}</p>
      <p>Fecha de fin: {{ fechaFin }}</p>
    </div> -->
    <div>
      <q-card class="q-pa-md">

        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            Estación Seleccionada: {{ estacion }}
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section v-if="estacionSelected">
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



        <!-- <q-card-section class="q-mb-md">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">📊 Seleccionar Variable:</div>
          <q-select v-model="selectedVariable" :options="variablesSelectArray" label="Elija una opción"
            @update:model-value="consultarMediciones" />

        </q-card-section> -->

        <q-separator />

        <!-- <q-card-section>
          <q-select v-model="dataLimit" :options="optionsDataLimit" label="Muestras por gráfico"
            @update:model-value="handleUpdateDataLimit" />
        </q-card-section> -->
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData1 && chartOptions1 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData1)" :chartOptions="chartOptions1"
            v-if="medicionesEstacion && chartData1 && chartOptions1 && medicionesEstacion.length > 0" />
        </q-card-section>

        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 1)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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

        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData2 && chartOptions2 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData2)" :chartOptions="chartOptions2"
            v-if="medicionesEstacion && chartData2 && chartOptions2 && medicionesEstacion.length > 0" />
        </q-card-section>
        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 2)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData3 && chartOptions3 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData3)" :chartOptions="chartOptions3"
            v-if="medicionesEstacion && chartData3 && chartOptions3 && medicionesEstacion.length > 0" />
        </q-card-section>
        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 3)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData4 && chartOptions4 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData4)" :chartOptions="chartOptions4"
            v-if="medicionesEstacion && chartData4 && chartOptions4 && medicionesEstacion.length > 0" />
        </q-card-section>
        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 4)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData5 && chartOptions5 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData5)" :chartOptions="chartOptions5"
            v-if="medicionesEstacion && chartData5 && chartOptions5 && medicionesEstacion.length > 0" />
        </q-card-section>
        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 5)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData6 && chartOptions6 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData6)" :chartOptions="chartOptions6"
            v-if="medicionesEstacion && chartData6 && chartOptions6 && medicionesEstacion.length > 0" />
        </q-card-section>
        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 6)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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
        <q-card-section style="overflow: hidden;"
          v-if="medicionesEstacion && chartData7 && chartOptions7 && medicionesEstacion.length > 0">
          <LineChart :chartData="convertChartDataToPlotly(chartData7)" :chartOptions="chartOptions7"
            v-if="medicionesEstacion && chartData7 && chartOptions7 && medicionesEstacion.length > 0" />
        </q-card-section>

        <q-card-section>
          <q-table v-if="medicionesEstacion && medicionesEstacion.length > 0" :rows="medicionesEstacion.filter(m => m.tipo_medicion.id === 7)"
            :columns="columnas" row-key="id" dense separator="horizontal" flat :rows-per-page-options="[10, 20, 30, 40]">
            <template v-slot:body-cell-unidad="props">
              <td>{{ props.row.tipo_medicion?.unidad ? props.row.tipo_medicion.unidad.descripcion : "U" }}</td>
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

        <!-- <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup @click="()=>handleCloseDialog()" />
        </q-card-actions> -->
      </q-card>

    </div>

  </div>
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import { ref, onMounted, inject, computed, watch, onUnmounted } from 'vue';
import { api } from 'src/boot/axios';
import { TEstacion } from 'src/components/models';
import LineChart from 'src/components/LineChart.vue'

const route = useRoute();

const variablesSelectArray = ref([
  { label: "Velocidad Viento", valor: 1 },
  { label: "Radiación", valor: 2 },
  { label: "Humedad Relativa", valor: 3 },
  { label: "Presión", valor: 4 },
  { label: "Temperatura", valor: 5 },
  { label: "Altitud", valor: 6 },
  { label: "Calidad Aire", valor: 7 }
]);

const optionsDataLimit = ref([
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
]);

const columnas = [
  //{ name: "id", label: "ID", field: "id", align: "left" as const },
  { name: "fecha", label: "Fecha Medición", field: "created_at", align: "right" as const },
  { name: "valor", label: "Valor", field: "valor", align: "right" as const },
  { name: "unidad", label: "Unidad", field: "unidad", align: "right" as const },
];

const convertChartDataToPlotly = (chartData: any): Partial<Plotly.PlotData>[] => {
  if (!chartData || !chartData.datasets) return [];

  return chartData.datasets.map((dataset: any) => ({
    x: chartData.labels, // Etiquetas en el eje X
    y: dataset.data, // Valores en el eje Y
    type: 'scatter', // Tipo de gráfico (línea)
    mode: 'lines+markers', // Muestra tanto la línea como los puntos
    name: dataset.label, // Nombre del dataset (ej. 'Ventas')
    line: { color: dataset.borderColor }, // Color de la línea
    hoverinfo: 'x+y', // Mostrar tanto el valor de X como el de Y
    hoverlabel: {
      bgcolor: 'rgba(0,0,0,0.7)', // Fondo del texto del hover
      font: { color: 'white' }, // Color del texto del hover
    },
  }));
};


const chartData1 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Velocidad Viento',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData2 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Radiación',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData3 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Humedad Relativa',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData4 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Presión',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData5 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Temperatura',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData6 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Altitud',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})

const chartData7 = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Mediciones Calidad Aire',
      data: [] as number[],
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.2)',
      fill: false,
      tension: 0.4
    }
  ]
})


const chartOptions1 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Velocidad Viento",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData1.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData1.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions2 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Radiación",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData2.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData2.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions3 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Humedad Relativa",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData3.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData3.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions4 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Presión",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData4.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData4.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions5 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Temperatura",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData5.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData5.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions6 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Altitud",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData6.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData6.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};

const chartOptions7 = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    text: "Mediciones Calidad Aire",
    display: true,
  },
  layout: {
    xaxis: {
      title: 'X',
      showgrid: true,
      zeroline: true,
      display: true,
      tickangle: -45, // Rotar las etiquetas del eje X para que se vean mejor
      tickvals: chartData7.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
      ticktext: chartData7.value.labels.filter((_, index) => index % 5 === 0), // Mostrar solo una cada dos etiquetas
    },
    yaxis: {
      title: 'Y',
      showgrid: true,
      zeroline: false,
    },
  },
  hovermode: 'x', // Modo de hover para mostrar solo la información más cercana
};


const selectedVariable = ref<any>(null);
const estacion = route.params.estacion || route.query.estacion;
const fechaInicio = route.params.fechaInicio || route.query.fechaInicio;
const fechaFin = route.params.fechaFin || route.query.fechaFin;
const dataLimit = ref({ label: '20', valor: 20 });

const estacionSelected = ref<TEstacion | null>(null);
  interface Medicion {
  id: number;
  created_at: string;
  valor: number;
  unidad: string;
  tipo_medicion: {
    id:number
    nombre: string,
    formato: string,
    created_at: string,
    updated_at: string,
    unidad: {
      id: number,
      descripcion: string,
      created_at: string,
      updated_at: string
    }
  }
}
const medicionesEstacion = ref<Medicion[]>([]);

const handleUpdateDataLimit = () => {
  console.log('handleUpdateDataLimit...');
  consultarMediciones();
};

const loadEstacionSelected = () => {
  console.log('Loading estacion selected...');
  console.log(`/estacion/bynumserie/${estacion}`);
  api.get(`/estacion/bynumserie/${estacion}`).then((response) => {
    console.log('Estacion selected loaded:', response.data);
    estacionSelected.value = response.data as TEstacion;

    consultarMediciones();

  }).catch(() => {
    console.log('Error loading estacion selected');
  });
};

const getEstadoColor = (estado: any) => {
  switch (estado) {
    case 1: return "green";
    case 2: return "red";
    case 3: return "orange";
    default: return "grey";
  }
};

const consultarMediciones=()=>{
  console.log('rango-fechas...')
  console.log('selectedVariable.value')
  console.log(selectedVariable.value)
  console.log('selectedVariable.value.label')
  //console.log(selectedVariable.value.label)
  const valorSelec=5

  if(estacionSelected.value){
    api.get(`/medicion/rango-fechas?startDate=${fechaInicio}&endDate=${fechaFin}&numeroSerie=${estacion}`).then((response) => {
      console.log('Mediciones loaded:', response.data);
      medicionesEstacion.value = response.data;

      console.log("medicionesEstacion.valuemedicionesEstacion.valuemedicionesEstacion.valuemedicionesEstacion.value")
      console.log(response.data)

      actualizarGrafico()

    }).catch(() => {
      console.log('Error loading mediciones');
    });
  }
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const actualizarGrafico = () => {
  //consultarMediciones2()
  console.log("medicionesEstacion.value ++++++++++++++-----")
  console.log(medicionesEstacion.value)

  const fechasMediciones1 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 1).map(m => m.created_at);
  const fechasMediciones2 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 2).map(m => m.created_at);
  const fechasMediciones3 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 3).map(m => m.created_at);
  const fechasMediciones4 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 4).map(m => m.created_at);
  const fechasMediciones5 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 5).map(m => m.created_at);
  const fechasMediciones6 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 6).map(m => m.created_at);
  const fechasMediciones7 = medicionesEstacion.value.filter(m => m.tipo_medicion.id === 7).map(m => m.created_at);


  const valoresMediciones1 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 1) ?? []).map(m => m.valor);
  const valoresMediciones2 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 2) ?? []).map(m => m.valor);
  const valoresMediciones3 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 3) ?? []).map(m => m.valor);
  const valoresMediciones4 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 4) ?? []).map(m => m.valor);
  const valoresMediciones5 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 5) ?? []).map(m => m.valor);
  const valoresMediciones6 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 6) ?? []).map(m => m.valor);
  const valoresMediciones7 = (medicionesEstacion.value.filter(m => m.tipo_medicion.id === 7) ?? []).map(m => m.valor);


  console.log("valoresMediciones1: !!!!!!!")
  console.log(valoresMediciones1)
  console.log("valoresMediciones2: !!!!!!!")
  console.log(valoresMediciones2)
  console.log("valoresMediciones3: !!!!!!!")
  console.log(valoresMediciones3)
  console.log("valoresMediciones4: !!!!!!!")
  console.log(valoresMediciones4)
  console.log("valoresMediciones5: !!!!!!!")
  console.log(valoresMediciones5)
  console.log("valoresMediciones6: !!!!!!!")
  console.log(valoresMediciones6)
  console.log("valoresMediciones7: !!!!!!!")
  console.log(valoresMediciones7)

  ////////////////////////////////////////
  chartData1.value.labels = fechasMediciones1

  if (chartData1.value.datasets[0]) {
    chartData1.value.datasets[0].data = valoresMediciones1
    chartData1.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData2.value.labels = fechasMediciones2

  if (chartData2.value.datasets[0]) {
    chartData2.value.datasets[0].data = valoresMediciones2
    chartData2.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData3.value.labels = fechasMediciones3

  if (chartData3.value.datasets[0]) {
    chartData3.value.datasets[0].data = valoresMediciones3
    chartData3.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData4.value.labels = fechasMediciones4

  if (chartData4.value.datasets[0]) {
    chartData4.value.datasets[0].data = valoresMediciones4
    chartData4.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData5.value.labels = fechasMediciones5

  if (chartData5.value.datasets[0]) {
    chartData5.value.datasets[0].data = valoresMediciones5
    chartData5.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData6.value.labels = fechasMediciones6

  if (chartData6.value.datasets[0]) {
    chartData6.value.datasets[0].data = valoresMediciones6
    chartData6.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////
  ////////////////////////////////////////
  chartData7.value.labels = fechasMediciones7

  if (chartData7.value.datasets[0]) {
    chartData7.value.datasets[0].data = valoresMediciones7
    chartData7.value.datasets[0].borderColor = getRandomColor();  // Color aleatorio para el borde
  }
  ////////////////////////////////////////


  console.log("chartdatasSSSSSSSSSSSSS")
  console.log(chartData1.value)
  console.log(chartData2.value)
  console.log(chartData3.value)
  console.log(chartData4.value)
  console.log(chartData5.value)
  console.log(chartData6.value)
  console.log(chartData7.value)


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


const getEstadoTexto = (estado: any) => {
  switch (estado) {
    case 1: return "Activa";
    case 2: return "Inactiva";
    case 3: return "En Mantenimiento";
    default: return "Desconocido";
  }
};

// const loadEstaciones = () => {
//   console.log('Loading estaciones...');
//   api.get('/estacion').then((response) => {
//     console.log('Users loaded:', response.data);

//     estacionesData.value = response.data as TEstacion[];
//     console.log("estacionesData.value")
//     console.log(estacionesData.value)


//     const featuresArray=estacionesData.value.map((estacion)=>{
//     return {
//       "type":"Feature",
//       "properties":{
//          "name":estacion.numero_serie,
//          "number":estacion.id
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [estacion.longitud,estacion.latitud],
//       },
//     }
//   });

//   estacionesFeatures.value=geoJson.readFeatures({
//     type: "FeatureCollection",
//     features: featuresArray,
//   });

//   console.log("estacionesFeatures.value")
//   console.log(estacionesFeatures.value)

//   }).catch(() => {
//     console.log('Error loading users');
//   });
// };

onMounted(() => {
  loadEstacionSelected();

});


</script>
