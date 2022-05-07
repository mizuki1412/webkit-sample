<template>
  <div v-loading="loading">
    <div class="flex flex-wrap items-center">
      <div>课程分类筛选：</div>
      <el-select v-model="types" multiple collapse-tags collapse-tags-tooltip clearable>
        <el-option v-for="e in typeList" :label="e.name" :value="e.id"></el-option>
      </el-select>
      <el-input placeholder="请输入搜索内容" clearable prefix-icon="search" class="ml-1" style="width: 240px"
                v-model="keywords"/>
      <div class="ml-1">
        <el-button type="primary" icon="search" @click="query">查询</el-button>
      </div>
      <div class="ml-1">
        <el-button type="success">新增</el-button>
      </div>
    </div>
    <kit-table ref="table" :from-server="true" :page-server-handle="pageHandle" class="mt-2">
      <el-table-column label="标题" prop="name" min-width="180"/>
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag v-if="row.status===0" type="warning">未审核</el-tag>
          <el-tag v-else-if="row.status===1" type="success">通过审核</el-tag>
          <el-tag v-else-if="row.status===-1" type="danger">审核拒绝</el-tag>
          <el-tag v-else type="info">已结束</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="155">
        <template #default="{ row }">
          <div class="flex justify-center">
            <el-button type="primary" size="small">修改</el-button>
          </div>
        </template>
      </el-table-column>
    </kit-table>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";

const router = useRouter()
const loading = ref(false)
const table = ref()
const types = ref([])
const typeList = ref([])
const keywords = ref()

async function pageHandle(pageNo, countInPage) {
  let data
  await useLoading(loading, async () => {
    console.log(`起始页=${pageNo}, 每页个数=${countInPage}`)
    // query rest api
    let res = []
    for (let i = 0; i < countInPage; i++) {
      res.push({name: "item" + pageNo + '-' + i, status: 1})
    }
    data = {
      data: res,
      currentPage: pageNo,
      totalPage: 3,
      total: 3 * countInPage
    }
  })()
  return data
}

async function query() {
  await table.value.refresh(1)
}

onMounted(useLoading(loading, async () => {
  await query()
}))
</script>
