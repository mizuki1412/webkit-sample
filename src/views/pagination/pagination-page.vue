<template>
  <a-spin :spinning="loading">
    <kit-pagination-page :data="list" v-model="listShow">
      <div class="flex flex-col gap-2">
        <div class="bg-white shadow-sm rounded-xs w-[100px] h-[30px] _flex_center" v-for="item in listShow">
          {{ item.name }}
        </div>
      </div>
    </kit-pagination-page>
  </a-spin>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";

const router = useRouter()
const loading = ref(false)
const list = ref([])
const listShow = ref([])

onMounted(useLoading(loading, async () => {
  for (let i = 0; i < 80; i++) {
    list.value.push({id: i, name: 'item+' + i})
  }
}))
</script>
