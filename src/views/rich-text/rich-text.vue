<template>
  <div>
    test rich text
    <kit-rich-text v-model="content" style="width: 100%"></kit-rich-text>
  </div>
</template>
<script setup>
import {ref, onMounted, watch} from "vue"

const loading = ref(false)
const content = ref('demo')

watch(content, ()=>{
  console.log(content.value)
})
onMounted(async () => {

})
</script>
