<template>
  <a-spin :spinning="loading">
    <div class="flex">
      <kit-icon name="fee" class="h-4 w-4 text-red-600"/>
      <a-empty class="cursor-pointer" @click="modal.visible = true">
        <template #description>
          test<span style="color: red">abc</span>
        </template>
      </a-empty>
      <v-chart style="width: 300px; height: 200px" :option="option1"></v-chart>
    </div>
    <a-button @click="testMessage">测试messagebox</a-button>
    <kit-pagination-page :data="data" v-model="dataDisplay">
      <div v-for="item in dataDisplay" :key="item.id">
        <div class="text-blue-600">{{ item.id }}</div>
      </div>
    </kit-pagination-page>
  </a-spin>
  <kit-modal :modal="modal" :confirm="confirm2">
    <template #title>abc</template>
    <a-select v-model="modal.data.val1">
      <a-select-option label="xx" :value="0"></a-select-option>
    </a-select>
  </kit-modal>
</template>
<script setup>
import {ref, onMounted} from "vue"
import {sleep} from "/lib/utils"
import {useLoading} from "/lib/service"
import {chartConfig} from "../../../lib/service/echarts-helper"
import _ from "lodash"
import {useConfirm} from "../../../lib/service/confirm";

const loading = ref(false)
const option1 = ref()
const modal = ref({
  visible: false,
  data: {},
})

function confirm2() {
}

const data1 = ref([
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4},
  {id: 5},
  {id: 6},
  {id: 7},
  {id: 8},
  {id: 9},
  {id: 10},
  {id: 11},
])
const data = ref([])
const dataDisplay = ref([])

function testMessage() {
  useConfirm("确定？", ()=>{
    console.log(12333)
  })
}

async function monitor(){
}

onMounted(
    useLoading(loading, async () => {
      await sleep(1000)
      option1.value = chartConfig({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      })
      modal.value.data.val1 = 0
      // test
    })
)
</script>
