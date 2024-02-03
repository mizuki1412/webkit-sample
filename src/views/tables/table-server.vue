<template>
  <a-table
      :data-source="listShow" sticky
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      row-key="name">
    <template #expandedRowRender="{ record }">
      {{record.name}}
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'type'">
        <div v-if="record.type===1">课程</div>
        <div v-else>活动</div>
      </template>
      <template v-else-if="column.key === 'start'">
        <div v-if="record.start">{{ formatDateTime(record.start) }}</div>
      </template>
      <template v-else-if="column.key === 'action'">
        <div class="flex gap-1">
          <a-button size="small" type="primary">
            <template #icon>
              <InfoOutlined />
            </template>
          </a-button>
          <a-popconfirm title="确认删除?" @confirm="remove(record)">
            <a-button size="small" danger>
              <template #icon>
                <DeleteFilled />
              </template>
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </template>
    <template #customFilterDropdown="params">
      <kit-table-custom-filter :params="params" />
    </template>
  </a-table>
</template>
<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {formatDateTime, sleep} from "../../../lib/utils";
import {DeleteFilled, InfoOutlined, SearchOutlined} from '@ant-design/icons-vue';
import KitTableCustomFilter from "../../../lib/components/table/kit-table-custom-filter.vue";

const router = useRouter()
const loading = ref(false)
const columns = [
  {
    title: '名称', dataIndex: 'name', key: 'name', fixed: true, width: '300px',
    sorter: {compare: (a, b) => a.name >= b.name},
    customFilterDropdown: true,
  },
  {title: '值', dataIndex: 'val', key: 'val', sorter: (a, b) => a.val >= b.val},
  {
    title: '类型', dataIndex: 'type', key: 'type',
  },
  {title: '开始时间', dataIndex: 'start', key: 'start'},
  {title: '操作', key: 'action', fixed: 'right', width: '100px'},
]
// 原始数据集
const list = ref([])
const listShow = ref([])

// 控制当前的pagination
const pagination = ref({
  total: 200,
  current: 1,
  pageSize: 10,
});

async function remove(row) {

}

// 调接口
// filters: {columnKey:xxx}
// sorter: {columnKey, order='ascend/descend'}
async function handleTableChange(pag={current:1, pageSize:10}, filters, sorter){
  loading.value = true
  await sleep(1000)
  console.log(pag, filters, sorter)
  // api
  let res = list.value
  for(let k of Object.keys(filters)){
    // console.log(k, f[k], f[k][0])
    res = res.filter(x=>x[k].indexOf(filters[k][0])>-1)
  }
  pagination.value.total = res.length
  res = res.slice((pag.current-1)*pag.pageSize, (pag.current)*pag.pageSize)
  listShow.value = res
  pagination.value.current = pag.current
  loading.value = false
}

onMounted(useLoading(loading, async () => {
  for (let i = 0; i < 30; i++) {
    list.value.push({
      name: "item" + i,
      val: i,
      type: i % 2,
      start: new Date()
    })
  }
  pagination.value.total = list.value.length
  listShow.value = list.value.slice(0,10)
}))

</script>
