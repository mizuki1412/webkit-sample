# init-vue

```vue
<template>
  <div class="flex flex-col gap-2" v-loading="loading">
    <div>
      <el-button type="success" @click="showModal()">新增</el-button>
    </div>
    <kit-table :data="list">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="description"></el-table-column>
      <el-table-column label="创建时间" prop="createDt"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{row}">
          <el-button type="primary" icon="Edit" circle @click="showModal(row)"/>
          <el-button type="danger" icon="Delete" circle @click="remove(row)"/>
        </template>
      </el-table-column>
    </kit-table>
  </div>
  <kit-modal
      id="depart-edit"
      :modal="modal"
      :draggable="true"
      :confirm="update"
      width="40%">
    <template #title>{{modal.data.id>0?'修改':'新增'}}</template>
    <el-form ref="form" label-width="100px" :model="modal.data">
      <el-form-item label="课程分类：" prop="category1" :rules="{ required: true, message: '请选择' }">
        <el-cascader v-model="modal.data.category1" clearable filterable :options="categories" />
      </el-form-item>
      <el-form-item label="收支：" prop="amount" :rules="{ required: true, message: '请填写' }">
        <el-input-number v-model="modal.data.amount" :precision="2" :step="1"/>
      </el-form-item>
      <el-form-item label="日期：" prop="dt" :rules="{ required: true, message: '请填写' }">
        <el-date-picker clearable type="datetime" v-model="modal.data.dt"/>
      </el-form-item>
      <el-form-item label="备注：" prop="remark" :rules="{ required: false, message: '请填写' }">
        <el-input type="textarea" clearable v-model="modal.data.remark"/>
      </el-form-item>
    </el-form>
  </kit-modal>
</template>

<script setup>
  import {ref, onMounted} from 'vue';
  import {useRouter} from "vue-router";
  import {useLoading} from "/lib/service";
  import { message } from 'ant-design-vue';
  const [messageApi, contextHolder] = message.useMessage();
  import _ from "lodash";

  const router = useRouter()
  const loading = ref(false)
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
    ElMessageBox.confirm(
        '', `确认删除？`, {
          type: 'error',
          center: true,
        }).then(async () => {
      await useLoading(loading, async function () {

      })()
      await query();
    })
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
