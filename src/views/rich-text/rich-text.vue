<template>
  <div>
    test rich text
    <kit-rich-text v-model="content" style="width: 100%"></kit-rich-text>
  </div>
</template>
<script setup>
import {ref} from "vue"

const content = ref('demo')
</script>
