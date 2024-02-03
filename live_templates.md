# init-vue

```vue
<template>
  <div class="flex flex-col gap-2">
    <a-button @click="showModal()">新增</a-button>
    <a-table :data-source="list" :loading="loading" sticky class="mt-2" :columns="columns" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="flex gap-1">
            <a-button size="small" type="primary" @click="showModal(record)">
              <template #icon>
                <FormOutlined />
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
  </div>
  <kit-modal
      id="demo1"
      :modal="modal"
      :confirm="update"
      width="50%">
    <template #title>{{ modal.data.id ? '修改' : '新增' }}课程信息</template>
    <a-form ref="form" :label-col="{style:{width:'100px'}}" :model="modal.data">
      <a-form-item label="分类多选" name="types" :rules="{ required: true, message: '请选择' }">
        <a-select v-model:value="modal.data.types" mode="multiple" allow-clear :field-names="{label: 'name'}" :options="typeList"></a-select>
      </a-form-item>
      <a-form-item label="分类对象" name="type" :rules="{ required: true, message: '请选择' }">
        <a-select v-model:value="modal.data.type" allow-clear label-in-value :field-names="{label: 'name'}" :options="typeList"></a-select>
      </a-form-item>
      <a-form-item label="日期" name="dt">
        <a-date-picker allow-clear v-model:value="modal.data.dt"/>
      </a-form-item>
      <a-form-item label="标题" name="name" :rules="[{ required: true, message: '请填写' }]">
        <a-input allow-clear v-model:value="modal.data.name"/>
      </a-form-item>
      <a-form-item label="简介" name="abstract" :rules="{ required: true, message: '请填写' }">
        <a-textarea allow-clear v-model:value="modal.data.abstract"/>
      </a-form-item>
    </a-form>
  </kit-modal>
</template>

<script setup>
  import {ref, onMounted} from 'vue';
  import {useRouter} from "vue-router";
  import {useLoading} from "/lib/service";
  import { message } from 'ant-design-vue';
  const [messageApi, contextHolder] = message.useMessage();
  import _ from "lodash";
  import {DeleteFilled, FormOutlined} from '@ant-design/icons-vue';
  import KitTableCustomFilter from "/lib/components/table/kit-table-custom-filter.vue";

  const router = useRouter()
  const loading = ref(false)
  const columns = [
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
    { title: '类型', dataIndex: 'type', key: 'type',
      customFilterDropdown: true,
      onFilter: (value, record) => {
        let s = "活动";
        if(record.type===1){
          s = "课程"
        }
        return s.includes(value.toLowerCase())
      }
    },
    { title: '开始时间', dataIndex: 'start', key: 'start' },
    { title: '操作', key: 'action', fixed: 'right', width:'100px' },
  ]
  const form = ref()
  const list = ref([])
  const modal = ref({
    visible: false,
    data: {}
  })

  async function query(){
    await useLoading(loading, _query)()
  }
  async function _query(){

  }

  async function remove(row) {
    await useLoading(loading, async function () {

    })()
    await query();
  }

  function showModal(row){
    modal.value.data = row?_.cloneDeep(row):{}

    modal.value.visible = true
  }
  async function update() {
    const valid = await form.value.validate();
    if (!valid) {
      return;
    }

    messageApi.success("操作成功")
    await _query()
  }

  onMounted(useLoading(loading, async ()=>{
    await _query()
  }))
</script>
```
