<template>
  <a-spin :spinning="loading">
    <a-table
        :data-source="list" sticky
        :columns="columns"
        :expand-column-width="100" row-key="name">
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
  </a-spin>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {formatDateTime} from "../../../lib/utils";
import {DeleteFilled, InfoOutlined, SearchOutlined} from '@ant-design/icons-vue';
import KitTableCustomFilter from "../../../lib/components/table/kit-table-custom-filter.vue";

const router = useRouter()
const loading = ref(false)
const columns = [
  {
    title: '名称', dataIndex: 'name', key: 'name', fixed: true, width: '300px',
    sorter: {compare: (a, b) => a.name >= b.name},
  },
  {title: '值', dataIndex: 'val', key: 'val', sorter: (a, b) => a.val >= b.val},
  {
    title: '类型', dataIndex: 'type', key: 'type',
    customFilterDropdown: true,
    onFilter: (value, record) => {
      let s = "活动";
      if (record.type === 1) {
        s = "课程"
      }
      return s.includes(value.toLowerCase())
    }
  },
  {title: '开始时间', dataIndex: 'start', key: 'start'},
  {title: '操作', key: 'action', fixed: 'right', width: '100px'},
]
const list = ref([])
const selectType = ref()
const selectTime = ref()

async function remove(row) {
  // useConfirm(
  //   '确认删除？', async () => {
  //   await useLoading(loading, async function () {
  //
  //   })()
  // })
  console.log(row)
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
}))

</script>
