<template>
  <div class="h-screen w-screen flex flex-col bg-gray-100">
    <div class="h-[48px] flex items-center bg-white shadow-md text-lg bg-blue-500 text-white">
      <div class="w-[25%] pl-4" @click="router.back()">
        <kit-icon name="common-arrow-left" class="w-[20px] h-[20px]"/>
      </div>
      <div class="w-[50%] text-center">{{router.currentRoute.value.meta.menuTitle}}</div>
      <div class="w-[25%]"></div>
    </div>
    <div class="overflow-auto" style="height: calc(100% - 48px);">
      <router-view />
    </div>
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
