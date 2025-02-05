<template>
  <div>
    <p>{{ title }}</p>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  title: string;
  active: boolean;
};

const props = withDefaults(defineProps<Props>(), {

});

const clickCount = ref(0);
function increment() {
  clickCount.value += 1;
  return clickCount.value;
}


</script>
