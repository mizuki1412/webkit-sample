<template>
  <svg aria-hidden="true" viewBox="0 0 1024 1024">
    <use v-if="symbolId" :xlink:href="symbolId" fill="currentColor"/>
  </svg>
</template>
<script setup>
// vite-plugin-svg-icons，引入svg的icon
import {computed} from "vue"

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
})

const symbolId = computed(() => {
  return "#icon-" + props.name
})
</script>