<template>
  <div v-loading="loading">
    <kit-icon name="fee" class="w-4 h-4 text-red-600" />
    <kit-empty @click="modal.visible = true">test<span style="color: red">abc</span></kit-empty>
    <v-chart style="width: 300px;height: 200px" :option="option1"></v-chart>
    <kit-pagination-page :data="data" v-model="dataDisplay">
      <div v-for="item in dataDisplay" :key="item.id">
        <div class="text-blue-600">{{item.id}}</div>
      </div>
    </kit-pagination-page>

    <kit-modal :modal="modal" :confirm="confirm2">
      <template #title>abc</template>
      <el-select v-model="modal.data.val1">
        <el-option label="xx" :value="0"></el-option>
      </el-select>
    </kit-modal>
  </div>
</template>
<script setup>
import {ref, onMounted, watch} from 'vue'
  import {sleep, chartConfig} from "/lib/utils";
  import {useLoading} from "/lib/service";

  const loading = ref(false)
  const option1 = ref()
  const modal = ref({
    visible: false,
    data:{}
  })

  function confirm2(){

  }
  const data1 = ref([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11}])
  const data = ref([])
  const dataDisplay = ref([])

  onMounted(useLoading(loading,async ()=>{
    await sleep(1000)
    option1.value=chartConfig({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    });
    modal.value.data.val1 = 0
  }))
</script>
