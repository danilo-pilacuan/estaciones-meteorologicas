<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, ChartConfiguration, registerables } from 'chart.js'

// Registra todos los elementos necesarios de Chart.js
Chart.register(...registerables)

interface Props {
  chartData: ChartConfiguration['data']
  chartOptions: ChartConfiguration['options']
}

const props = defineProps<Props>()

const canvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)

onMounted(() => {
  if (canvas.value) {
    chartInstance.value = new Chart(canvas.value, {
      type: 'line',
      data: props.chartData,
      options: props.chartOptions
    })
  }
})

watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance.value) {
      chartInstance.value.data = newData
      chartInstance.value.destroy()
      chartInstance.value = new Chart(canvas.value, {
      type: 'line',
      data: props.chartData,
      options: props.chartOptions
    })
    }
  },
  { deep: true }
)
</script>
