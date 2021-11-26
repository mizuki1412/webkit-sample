<template>
  <div>
    page3 {{loading}}
  </div>
</template>
<script setup>
  import {ref, onMounted} from 'vue'

  const loading = ref(false)

  onMounted(()=>{
    console.log('mounted page3')
  })
</script>
