<template>
  <a-spin :spinning="loading">
    <kit-gantt :tasks="ganttTasks" :columns="ganttColumns" class="h-[400px]"></kit-gantt>
  </a-spin>
</template>
<script setup>
import { ref,onMounted } from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";

const router = useRouter()
const loading = ref(false)
const ganttTasks = ref({
  data: [
    {id: 1, text: "Project #1", start_date: null, duration: null, parent:0, progress: 0, open: true},
    {id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration:5, parent:1, progress: 1, color:"green"},
    {id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration:2, parent:1, progress: 0.5},
    {id: 4, text: "Task #3", start_date: null, duration: null, parent:1, progress: 0.8, open: true},
    {id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration:2, parent:4, progress: 0.2},
    {id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration:1, parent:4, progress: 0}
  ],
})
const ganttColumns = ref([
  { align: 'left', name: 'text', label: '任务名称', tree: true },
  { align: 'left', name: 'start_date', label: '开始时间' }
])

onMounted(() => {

})
</script>
