<template>
  <a-button type="primary" @click="showModal()">新增</a-button>
  <a-table
      :data-source="list" row-key="id"
      :loading="loading" sticky class="mt-2"
      :columns="[
          {
            title: '名称', dataIndex: 'name', key: 'name', width: '300px',
            customFilterDropdown: true,
            onFilter: antTableFilter('name')
          },
          { title: '值', dataIndex: 'val', key: 'val', sorter: (a, b) => a.val >= b.val},
          {
            title: '类型', dataIndex: 'type', key: 'type',
            customFilterDropdown: true,
            onFilter: (value, record) => {
              let s = '活动';
              if (record.type === 1) {
                s = '课程'
              }
              return s.includes(value.toLowerCase())
            }
          },
          {
            title: '开始时间', dataIndex: 'start', key: 'start',
            sorter: antSortDate('startDt'), customRender: antRenderDate('startDt')
          },
          { title: '操作', key: 'action', fixed: 'right', width: '120px'},
      ]">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div class="flex gap-1">
          <a-button size="small" type="primary" @click="showModal(record)">
            <template #icon>
              <FormOutlined/>
            </template>
          </a-button>
          <a-popconfirm title="确认删除?" @confirm="remove(record)">
            <a-button size="small" danger>
              <template #icon>
                <DeleteFilled/>
              </template>
            </a-button>
          </a-popconfirm>
        </div>
      </template>
    </template>
    <template #customFilterDropdown="params">
      <kit-table-custom-filter :params="params"/>
    </template>
  </a-table>
  <kit-modal
      v-model:visible="modalVisible"
      channel-id="demo1"
      :confirm="update"
      width="50%">
    <template #title>{{ formData.id ? '修改' : '新增' }}课程信息</template>
    <a-form ref="form" :label-col="{ style: { width: '80px' } }" :model="formData">
      <a-form-item label="分类多选" name="types" :rules="[{ required: true, message: '请选择' }]">
        <a-select
            v-model:value="formData.types" mode="multiple" allow-clear
            :field-names="{label: 'name'}"
            :options="[]"></a-select>
      </a-form-item>
      <a-form-item label="分类对象" name="type" :rules="[{ required: true, message: '请选择' }]">
        <a-select
            v-model:value="formData.type" allow-clear label-in-value :field-names="{label: 'name'}"
            :options="[]"></a-select>
      </a-form-item>
      <a-form-item label="日期" name="dt">
        <a-date-picker show-time allow-clear v-model:value="formData.dt"/>
      </a-form-item>
      <a-form-item label="标题" name="name" :rules="[{ required: true, message: '请填写' }]">
        <a-input allow-clear v-model:value="formData.name"/>
      </a-form-item>
      <a-form-item label="简介" name="abstract" :rules="[{ required: true, message: '请填写' }]">
        <a-textarea allow-clear v-model:value="formData.abstract"/>
      </a-form-item>
    </a-form>
  </kit-modal>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {message} from 'antdv-next';
import {DeleteFilled, FormOutlined} from '@antdv-next/icons';
import KitTableCustomFilter from "/lib/components/table/kit-table-custom-filter.vue";
import {antRenderDate, antSortDate, antTableFilter} from "/lib/utils/antdv";

const router = useRouter()
const loading = ref(false)
const form = ref()
const list = ref([])
const modalVisible = ref(false)
const formData = ref({})

async function query() {
  await useLoading(loading, _query)()
}

async function _query() {
  // todo
}

async function remove(row) {
  await useLoading(loading, async function () {
    // todo
    await _query();
  })()
}

function showModal(row) {
  formData.value = row ? JSON.parse(JSON.stringify(row)) : {types: [], type: null, dt: null, name: '', abstract: ''}
  modalVisible.value = true
}

async function update() {
  try {
    const values = await form.value.validateFields()
    formData.value = values
  } catch (e) {
    if (e?.errorFields) {
      form.value.setFields(e.errorFields.map(f => ({
        name: f.name,
        errors: f.errors,
      })))
    }
    return false
  }
  // todo
  message.success("操作成功")
  await _query()
}

onMounted(useLoading(loading, async () => {
  await _query()
}))
</script>