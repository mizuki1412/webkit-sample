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
    <div class="card shadow-sm mt-2 w-[300px]">
      <div class="card-body">
        <div class="card-title">abc</div>
        cbb
      </div>
    </div>
    <div class="stats shadow-sm mt-2">
      <div class="stat place-items-center">
        <div class="stat-title">Downloads</div>
        <div class="stat-value">31K</div>
        <div class="stat-desc">From January 1st to February 1st</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Users</div>
        <div class="stat-value text-secondary">4,200</div>
        <div class="stat-desc text-secondary">↗︎ 40 (2%)</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">New Registers</div>
        <div class="stat-value">1,200</div>
        <div class="stat-desc">↘︎ 90 (14%)</div>
      </div>
    </div>
  </a-spin>
  <kit-modal :modal="modal" :confirm="confirm2">
    <template #title>abc</template>
    <a-select class="w-[50%]" v-model="modal.data.val1" :options="[{label: 'aaa', value: 'aaa'}]"></a-select>
  </kit-modal>
</template>
<script setup>
import {ref, onMounted} from "vue"
import {sleep} from "/lib/utils"
import {useLoading} from "/lib/service"
import {chartConfig} from "../../../lib/service/echarts-helper"
import _ from "lodash"
import {useConfirm} from "../../../lib/service/confirm";
import {message} from "ant-design-vue";

const loading = ref(false)
const option1 = ref()
const modal = ref({
  visible: false,
  data: {},
})

function confirm2() {
}

const data = ref([])
const dataDisplay = ref([])

function testMessage() {
  useConfirm("确定？", ()=>{
    message.info(12333)
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
