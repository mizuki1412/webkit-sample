<template>
  <div
      class="flex h-screen w-screen flex-col place-content-between bg-gray-100"
  >
    <div
        class="flex h-[48px] items-center justify-center bg-blue-500 text-lg text-white shadow-md"
    >
      {{ configKit.titleApp }}
    </div>
    <div class="overflow-auto" style="height: calc(100% - 48px - 50px)">
      <router-view/>
    </div>
    <div class="flex w-full bg-white shadow-sm">
      <div
          v-for="(item, index) in storeAppMenu"
          :key="item.name"
          class="flex h-[50px] flex-col items-center justify-center"
          :class="
          storeCurrentRoute.name === item.name
            ? 'text-blue-500'
            : 'text-gray-600'
        "
          :style="{ width: 'calc(100% / ' + storeAppMenu.length + ')' }"
          @click="jump(item.name)"
      >
        <kit-icon :name="item.menuIcon" class="mb-[3px] h-[22px] w-[22px]"/>
        <div class="text-xs">{{ item.menuTitle }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from "vue"
import {useRouter} from "vue-router"
import {useLoading} from "/lib/service"
import {storeAppMenu} from "../router"
import {configKit, storeCurrentRoute} from "../store"

const props = defineProps({
  // todo
  noPadding: {
    type: Boolean,
    default: false,
  },
})
const router = useRouter()
const loading = ref(false)

function jump(name) {
  router.push({name})
}

onMounted(useLoading(loading, async () => {
}))
</script>
