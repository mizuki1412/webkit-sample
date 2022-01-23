<template>
  <div>
    <slot/>
    <kit-empty v-if="data.length===0">暂无内容</kit-empty>
    <div class="flex justify-center">
      <el-pagination
          background
          layout="prev, pager, next, jumper, sizes, total"
          class="mt-2"
          :total="data.length"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref, watch} from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  // 分页
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['update:modelValue'])

const pageCount = ref(1);

// 正常操作变化
const currentPageInner = ref(props.currentPage);
watch(() => props.currentPage, currentPage => currentPageInner.value = currentPage);
const pageSizeInner = ref(props.pageSize);
watch(() => props.pageSize, pageSize => pageSizeInner.value = pageSize);
function handleSizeChange(val){
  pageSizeInner.value = val
}
function handleCurrentChange(val){
  currentPageInner.value = val
}

function _displayData(){
  return props.data.slice((currentPageInner.value - 1) * pageSizeInner.value, currentPageInner.value * pageSizeInner.value);
}
const displayData = computed(() => _displayData());
watch(displayData, d=>emit('update:modelValue', _displayData()));
onMounted(()=>{
  emit('update:modelValue', _displayData())
})
</script>
