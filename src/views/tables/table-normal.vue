<template>
  <a-spin :spinning="loading">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div>类型筛选:</div>
        <a-select v-model:value="selectType" placeholder="类型" allowClear class="w-[120px]" :options="[{label:'课程', value:1},{label:'活动', value:2},]"></a-select>
        <div class="ml-1">时间范围筛选:</div>
        <a-range-picker
            allowClear
            style="width: 320px"
            show-time
            v-model:value="selectTime"/>
        <a-button type="primary">查询</a-button>
        <a-button class="_btn_success">成功</a-button>
        <a-button class="_btn_warn">警告</a-button>
      </div>
    </div>
    <a-table :data-source="list" sticky class="mt-2" :columns="columns" :scroll="{ x: 2000 }" :expand-column-width="100" row-key="name">
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
    </a-table>
  </a-spin>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {formatDateTime} from "../../../lib/utils";
import {DeleteFilled, InfoOutlined} from '@ant-design/icons-vue';

const router = useRouter()
const loading = ref(false)
const columns = ref([
  { title: '名称', dataIndex: 'name', key: 'name', fixed:true, width:'300px',
    sorter:{compare: (a,b)=>a.name>=b.name},
    filters: [
      {
        text: '小于10',
        value: 1,
      },
      {
        text: '大于20',
        value: 2,
      }
    ],
    onFilter: (value, record) => {
      if(value===1 && record.val<10){
        return true
      }else if(value===2 && record.val>20){
        return true
      }
      return false
    }
  },
  { title: '值', dataIndex: 'val', key: 'val', sorter:(a,b)=>a.val>=b.val },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '开始时间', dataIndex: 'start', key: 'start' },
  { title: '操作', key: 'action', fixed: 'right', width:'100px' },
])
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
