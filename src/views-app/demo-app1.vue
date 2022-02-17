<template>
  <div v-loading="loading">
    app page1
  </div>
</template>
<script setup>
import { ref,onMounted } from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";

const router = useRouter()
const loading = ref(false)

onMounted(useLoading(loading, async ()=>{

}))
</script>
