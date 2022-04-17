<template>
  <div class="flex h-screen w-screen flex-col bg-gray-100">
    <div
        class="flex h-[48px] items-center bg-white bg-blue-500 text-lg text-white shadow-md"
    >
      <div class="w-[25%] pl-4" @click="back">
        <kit-icon name="common-arrow-left" class="h-[20px] w-[20px]"/>
      </div>
      <div class="w-[50%] text-center">
        {{ router.currentRoute.value.meta.menuTitle }}
      </div>
      <div class="w-[25%]"></div>
    </div>
    <div class="overflow-auto" style="height: calc(100% - 48px)">
      <router-view/>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from "vue"
import {useRouter} from "vue-router"
import {useLoading} from "/lib/service"

const router = useRouter()
const loading = ref(false)

function back() {
  router.back()
}

onMounted(useLoading(loading, async () => {
}))
</script>
