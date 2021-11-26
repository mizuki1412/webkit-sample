<template>
  <div>
    page2
  </div>
</template>
<script setup>
  import { ref,onMounted } from 'vue'
  import {BoxList} from "../../dao/test";
  const loading = ref(false)
  onMounted(async ()=>{
    let res = await BoxList()
    console.log(res)
  })
</script>
