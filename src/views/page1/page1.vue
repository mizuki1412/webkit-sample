<template>
    <a-spin :spinning="loading">
        <div class="flex">
            <kit-icon name="fee" class="h-4 w-4 text-red-600" />
            <a-empty class="cursor-pointer" @click="modalVisible = true">
                <template #description>
                    test<span style="color: red">abc</span>
                </template>
            </a-empty>
            <v-chart autoresize style="width: 300px; height: 200px" :option="option1"></v-chart>
        </div>
        <a-button @click="testMessage">测试messagebox</a-button>
        <div class="mt-2 w-[300px] rounded-lg border border-border bg-container p-6 shadow-sm">
            <div class="text-xs font-medium tracking-wider text-gray-400 uppercase">卡片示例</div>
            <div class="mt-1">Tailwind class 直接落卡片样式</div>
        </div>
        <div class="flex gap-2 mt-2">
            <div class="flex-1 rounded-lg border border-border bg-container p-6 shadow-sm">
                <div class="text-xs font-medium tracking-wider text-gray-400 uppercase">Downloads</div>
                <div class="mt-1 text-xl font-bold">31K</div>
                <div class="text-xs text-gray-400">From January 1st to February 1st</div>
            </div>
            <div class="flex-1 rounded-lg border border-border bg-container p-6 shadow-sm">
                <div class="text-xs font-medium tracking-wider text-gray-400 uppercase">Users</div>
                <div class="mt-1 text-xl font-bold text-primary">4,200</div>
                <div class="text-xs text-success">↗︎ 40 (2%)</div>
            </div>
            <div class="flex-1 rounded-lg border border-border bg-container p-6 shadow-sm">
                <div class="text-xs font-medium tracking-wider text-gray-400 uppercase">New Registers</div>
                <div class="mt-1 text-xl font-bold">1,200</div>
                <div class="text-xs text-danger">↘︎ 90 (14%)</div>
            </div>
        </div>
    </a-spin>
    <kit-modal v-model:visible="modalVisible" v-model:loading="modalLoading">
        <template #title>abc</template>
        <a-select class="w-[50%]" v-model="val1" :options="[{ label: 'aaa', value: 'aaa' }]"></a-select>
    </kit-modal>
</template>
<script setup>
import { ref, computed, onMounted } from "vue"
// echarts 按需：仅本页引入 v-chart（组件本体在 web-frame/plugin/echarts 具名导出）
import { ECharts as VChart } from "/web-frame/plugin/echarts"
import { sleep } from "/web-frame/utils"
import { useLoading } from "/web-frame/service"
import { chartConfig } from "/web-frame/service/echarts-helper"
import { useConfirm } from "/web-frame/service/confirm";
import { message } from "antdv-next";

const loading = ref(false)
const modalVisible = ref(false)
const modalLoading = ref(false)
const val1 = ref()

// 图表走 echarts 默认配色（页面内需自定义配色时直接在此写值）
const option1 = computed(() => {
  return chartConfig({
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
        smooth: true,
      },
    ],
  })
})

function testMessage() {
    useConfirm("确定？", () => {
        message.info(12333)
    })
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
    })
)
</script>
