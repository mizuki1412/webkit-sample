<template>
  <slot/>
  <a-empty v-if="data.length === 0"></a-empty>
  <a-pagination
      v-if="fromServer"
      class="mt-2"
      :show-total="total => `共 ${total} 条`"
      :total="total"
      :current="currentPageInner"
      @change="pageServerHandle0"
      @show-size-change="handleSizeChange"
      :page-size-options="pageSizes"
  />
  <a-pagination
      v-else
      class="mt-2"
      :show-total="total => `共 ${total} 条`"
      :total="data.length"
      @change="handleCurrentChange"
      @show-size-change="handleSizeChange"
      :page-size-options="pageSizes"
  />
</template>
<script setup>
import {computed, onMounted, ref, watch} from "vue"
import _ from "lodash";

const modelValue = defineModel()
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
    default: () => ['10', '20', '30', '40', '50'],
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  // 服务端分页开关：在服务端分页模式，data不需要填
  // eg: ref="table" :from-server="true" :page-server-handle="pageHandle"
  // 通过refresh触发初始和刷新
  fromServer: {
    type: Boolean,
    default: false,
  },
  // 服务端分页处理函数，
  // 传入参数：page-当前页；countInPage-一页的个数
  // 返回值 {data, currentPage-当前页, total-总数, totalPage-总页数}
  pageServerHandle: {
    type: Function,
    default: () => {
    },
  },
})

const pageCount = ref(1)

// 正常操作变化
const currentPageInner = ref(props.currentPage)
watch(
    () => props.currentPage,
    (currentPage) => (currentPageInner.value = currentPage)
)
const pageSizeInner = ref(props.pageSize)
watch(
    () => props.pageSize,
    (pageSize) => (pageSizeInner.value = pageSize)
)

function handleSizeChange(current, size) {
  pageSizeInner.value = size
}

function handleCurrentChange(val) {
  currentPageInner.value = val
}

function _displayData() {
  if (props.fromServer) {
    return dataList.value
  } else {
    return _.slice(props.data, (currentPageInner.value - 1) * pageSizeInner.value, currentPageInner.value * pageSizeInner.value)
  }
}

const displayData = computed(() => _displayData())
watch(displayData, (d) => modelValue.value = _displayData())
onMounted(() => {
  modelValue.value = _displayData()
})

// 服务端分页处理函数包装
const dataList = ref([])
const currentPage = ref(1)
const total = ref(0)

async function pageServerHandle0(page) {
  currentPageInner.value = page
  const data = await props.pageServerHandle(page, pageSizeInner.value)
  dataList.value = data.data
  currentPage.value = data.currentPage
  total.value = data.total
  total.totalPage = data.totalPage
}

// 服务端分页时外部调用刷新，也是初始触发的接口
async function refresh(pageNo) {
  await pageServerHandle0(pageNo ? pageNo : currentPageInner.value)
}

defineExpose({refresh})
</script>
