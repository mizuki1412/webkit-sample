<template>
  <div>
    test rich text
    <kit-rich-text v-model="content" style="width: 100%"></kit-rich-text>
  </div>
</template>
<script setup>
  import { ref,onMounted } from 'vue'
  const loading = ref(false)
  const content = ref(false)

  onMounted(async ()=>{

  })
</script>
