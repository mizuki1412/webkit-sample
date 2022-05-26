<template>
  <div>
    <el-table
        ref="table"
        stripe
        :data="displayData"
        @selection-change="selectChange"
        @sort-change="sortChange"
    >
      <slot/>
    </el-table>
    <div class="flex justify-center">
      <el-pagination
          v-if="fromServer"
          background
          class="mt-1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPageInner"
          @current-change="pageServerHandle0"
          @size-change="handleSizeChange"
          :page-sizes="pageSizes"
      />
      <el-pagination
          v-else-if="!noPagination"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="mt-1"
          :total="data.length"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from "vue"

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  tableRef:{
    type: Object,
    default:()=>null
  },
  selectChange: {
    type: Function,
    default: () => {},
  },
  // 分页数
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
  noPagination: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(["update:currentPage", "update:pageSize", "update:tableRef"])

// 正常操作变化
const currentPageInner = ref(props.currentPage)
watch(
    () => props.currentPage,
    (currentPage) => (currentPageInner.value = currentPage)
)
watch(currentPageInner, (currentPageInner) =>
    emit("update:currentPage", currentPageInner)
)
const pageSizeInner = ref(props.pageSize)
watch(
    () => props.pageSize,
    (pageSize) => (pageSizeInner.value = pageSize)
)
watch(pageSizeInner, (pageSizeInner) => emit("update:pageSize", pageSizeInner))

function handleSizeChange(val) {
  // 每页个数更改
  pageSizeInner.value = val
  if (props.fromServer) {
    refresh(1)
  }
}

function handleCurrentChange(val) {
  currentPageInner.value = val
}

// table展示的数据
const displayData = computed(() => {
  if (props.fromServer) {
    return dataList.value
  } else if (props.noPagination) {
    return props.data
  } else {
    if (props.data) {
      return props.data.slice(
          (currentPageInner.value - 1) * pageSizeInner.value,
          currentPageInner.value * pageSizeInner.value
      )
    } else {
      return []
    }
  }
})

function sortChange(p) {
  if (!p.prop) {
    return
  }
  // 存在children
  const ps = p.prop.split(".")
  props.data?.sort((a, b) => {
    let aa = a[ps[0]]
    let bb = b[ps[0]]
    for (let i = 1; i < ps.length; i++) {
      aa = aa[ps[i]]
      bb = bb[ps[i]]
    }
    if (p.order === "ascending") {
      if (aa > bb) {
        return 1
      } else if (aa < bb) {
        return -1
      } else {
        return 0
      }
    } else {
      if (aa > bb) {
        return -1
      } else if (aa < bb) {
        return 1
      } else {
        return 0
      }
    }
  })
}

// 使用：v-on:ref="table = $event"
const table = ref(null)
watch(table, () => {
  emit("update:tableRef", table.value)
})

// 服务端分页处理函数包装
const dataList = ref([])
const currentPage = ref(1)
const total = ref(0)
const totalPage = ref(1)

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
