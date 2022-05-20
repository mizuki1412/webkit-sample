<template>
  <div v-loading="loading">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div>类型筛选:</div>
        <el-select v-model="selectType" placeholder="类型" clearable class="w-[120px]">
          <el-option label="课程" :value="1"/>
          <el-option label="活动" :value="2"/>
        </el-select>
        <div class="ml-1">时间范围筛选:</div>
        <el-date-picker
            clearable
            style="width: 280px"
            v-model="selectTime"
            type="daterange"/>
        <div>
          <el-button type="primary">查询</el-button>
        </div>
        <div>
          <el-button type="success">新增</el-button>
        </div>
      </div>
      <el-input
          placeholder="请输入搜索内容"
          clearable
          prefix-icon="search"
          style="width:200px"
          v-model="input"/>
    </div>
    <kit-table :data="flist" v-model:tableRef="tableRef" class="mt-2 w-full">
      <el-table-column type="expand">
        <template #default="{row}">
          demo expand
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" min-width="200"/>
      <el-table-column label="类型">
        <template #default="{row}">
          <div v-if="row.type===1">课程</div>
          <div v-else>活动</div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="150">
        <template #default="{row}">
          <div v-if="row.start">{{ formatDateTime(row.start) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template #default="{row}">
          <div class="flex gap-0.5">
            <el-button size="small" type="warning">修改</el-button>
            <el-button size="small" type="primary" @click="expand(row)">查看详情</el-button>
          </div>
        </template>
      </el-table-column>
    </kit-table>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading, useSearch} from "/lib/service";
import {formatDateTime} from "../../../lib/utils";

const router = useRouter()
const loading = ref(false)
const list = ref([])
const selectType = ref()
const selectTime = ref()
const tableRef = ref()
const [input, flist] = useSearch(list, {
  includeProps: ['name'],
})

function expand(val){
  tableRef.value.toggleRowExpansion(val);
}

onMounted(useLoading(loading, async () => {
  for (let i = 0; i < 80; i++) {
    list.value.push({
      name: "item" + i,
      type: i % 2,
      start: new Date()
    })
  }
}))
</script>
