<template>
  <div class="w-full" ref="ganttRef"></div>
</template>

<script setup>
/***
 * 甘特图组件
 * https://github.com/DHTMLX/gantt
 * https://docs.dhtmlx.com/gantt/desktop__loading.html#dataproperties
 * tasks data 参数:
 *  id, text, start_date:Date/string, end_date(duration),id, progress(0-1),row_height,bar_height
 *  parent 父id,
 *  color, textColor, progressColor
 */
import {onMounted, onUnmounted, ref} from "vue";
import { gantt } from 'dhtmlx-gantt'

const props = defineProps({
  // 任务对象
  tasks: {
    type: Object,
    default: () => {
      return {
        data: [], // 数据数组
        links: [] // 连接关系
      }
    }
  },
  // 显示列设置
  columns: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 显示单位
  scaleUnit: {
    type: String,
    default: 'day' // “minute”, “hour”, “day”, “week”, “quarter”, “month”, “year”
  },
  // 时间显示格式
  dateScale: {
    type: String,
    default: '%Y-%m-%d'
  }
})
const ganttRef = ref()

function init(){
  // 默认配置
  gantt.config.xml_date = '%Y-%m-%d'
  gantt.i18n.setLocale('cn') // 设置中文
  gantt.config.readonly = true // 设置为只读
  // 显示列配置
  gantt.config.columns = props.columns
  gantt.config.scale_unit = props.scaleUnit
  gantt.config.date_scale = props.dateScale
  gantt.init(ganttRef.value)
  refresh()
}

function refresh(){
  // 渲染数据
  gantt.clearAll()
  gantt.parse(props.tasks)
}

onMounted(init)
// 不能destructor，否则$services为null
// onUnmounted(()=>gantt.destructor())
defineExpose({refresh})
</script>
