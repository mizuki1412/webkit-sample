<template>
  <div>
    <kit-icon name="fee" class="w-4 h-4 text-red-600" />
    <kit-empty @click="modal.visible = true">test<span style="color: red">abc</span></kit-empty>
    <v-chart style="width: 300px;height: 200px" :option="option1"></v-chart>
<!--    <el-button type="primary">button</el-button>-->
    <kit-modal :modal="modal" :confirm="confirm2">
      <template #title>abc</template>
      测试
    </kit-modal>
  </div>
</template>
<script setup>
  import {ref, onMounted} from 'vue'
  import {sleep, chartConfig} from "/lib/utils";
  import {useLoading} from "/lib/service";

  const loading = ref(false)
  const option1 = ref()
  const modal = ref({
    visible: false
  })

  function confirm2(){
    // confirm()
    // errorMessage("阿里", {type:'modal'})
  }

  onMounted(useLoading(loading,async ()=>{
    await sleep(2000)
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
    console.log(option1.value)
  }))
</script>
