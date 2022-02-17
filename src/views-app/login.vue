<template>
  <div v-loading="loading">
    app login page
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
