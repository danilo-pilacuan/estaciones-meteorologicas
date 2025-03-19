<template>
  <div ref="chartDiv" style="width: 100%; height: 420px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Plotly from 'plotly.js-dist'

interface Props {
  chartData: Partial<Plotly.PlotData>[] | null
  chartOptions?: Partial<Plotly.Layout> | null
}

const props = defineProps<Props>()
const chartDiv = ref<HTMLDivElement | null>(null)

const createOrUpdateChart = () => {
  if (!chartDiv.value) return

  // If chart data exists, initialize or update the chart
  if (props.chartData) {
    if (!props.chartOptions) props.chartOptions = {} // Default empty options if not provided

    if (!chartDiv.value) return

    // Initialize or update the chart
    if (chartDiv.value && !chartDiv.value._fullLayout) {
      Plotly.newPlot(chartDiv.value, props.chartData, props.chartOptions)
    } else {
      Plotly.react(chartDiv.value, props.chartData, props.chartOptions)
    }
  }
}

onMounted(() => {
  createOrUpdateChart()
})

watch(
  () => [props.chartData, props.chartOptions],
  () => {
    createOrUpdateChart()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (chartDiv.value) {
    Plotly.purge(chartDiv.value)
  }
})
</script>
