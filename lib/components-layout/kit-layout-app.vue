<template>
  <div class="h-screen w-screen flex flex-col place-content-between bg-gray-100">
    <div class="h-[48px] flex justify-center items-center bg-white shadow-md text-lg bg-blue-500 text-white">{{configKit.titleApp}}</div>
    <div class="overflow-auto" style="height: calc(100% - 48px - 50px);">
      <router-view />
    </div>
    <div class="flex w-full shadow bg-white">
      <div
          v-for="(item,index) in storeAppMenu" :key="item.name"
          class="flex flex-col justify-center items-center h-[50px]"
          :class="storeCurrentRoute.name===item.name?'text-blue-500':'text-gray-600'"
          :style="{width: 'calc(100% / '+storeAppMenu.length+')'}"
          @click="jump(item.name)">
        <kit-icon :name="item.menuIcon" class="w-[22px] h-[22px] mb-[3px]"/>
        <div class="text-xs">{{item.menuTitle}}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted } from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {storeAppMenu} from "../router";
import {configKit, storeCurrentRoute} from "../store";

const props = defineProps({
  // todo
  noPadding:{
    type:Boolean,
    default:false
  }
})
const router = useRouter()
const loading = ref(false)

function jump(name){
  router.push({name})
}

onMounted(useLoading(loading, async ()=>{
}))
</script>
