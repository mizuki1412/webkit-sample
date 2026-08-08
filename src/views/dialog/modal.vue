<template>
  <a-spin :spinning="loading">
    <a-button @click="show">弹出</a-button>
    <a-button @click="modalVisible2 = true" class="ml-2">bug:过高时拖拽</a-button>
    <kit-modal
        v-model:visible="modalVisible"
        v-model:loading="modalLoading"
        channel-id="demo1"
        :confirm="update"
        width="50%">
      <template #title>{{ formData?.id ? '修改' : '新增' }}课程信息</template>
      <a-form ref="formRef" :label-col="{ style: { width: '80px' } }" :model="formData">
        <a-form-item label="题图" name="img" :rules="[{ required: true, message: '请填写' }]">
          <kit-upload :action="upload" :files="formData.img?[formData.img]:[]"></kit-upload>
        </a-form-item>
        <a-form-item label="分类多选" name="types" :rules="[{ required: true, message: '请选择' }]">
          <a-select v-model:value="formData.types" mode="multiple" allow-clear :field-names="{label: 'name'}" :options="typeList"></a-select>
        </a-form-item>
        <a-form-item label="分类对象" name="type" :rules="[{ required: true, message: '请选择' }]">
          <a-select v-model:value="formData.type" allow-clear label-in-value :field-names="{label: 'name'}" :options="typeList"></a-select>
        </a-form-item>
        <a-form-item label="日期" name="dt">
          <a-date-picker allow-clear v-model:value="formData.dt"/>
        </a-form-item>
        <a-form-item label="标题" name="name" :rules="[{ required: true, message: '请填写' }]">
          <a-input allow-clear v-model:value="formData.name"/>
        </a-form-item>
        <a-form-item label="简介" name="abstract" :rules="[{ required: true, message: '请填写' }]">
          <a-textarea allow-clear v-model:value="formData.abstract"/>
        </a-form-item>
      </a-form>
    </kit-modal>
    <kit-modal
        v-model:visible="modalVisible2"
        width="50%">
      <template #title>课程信息</template>
      <div class="h-[2000px]">1</div>
    </kit-modal>
  </a-spin>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading} from "/lib/service";
import {message} from "antdv-next";

const router = useRouter()
const loading = ref(false)
const formRef = ref()
const formData = ref(null)
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalVisible2 = ref(false)
const typeList = ref([{value: 1, name: "item1"}, {value: 2, name: "item2", text: 11}, {value: 3, name: "item3"}, {value: 4, name: "item4"}])

function show() {
  if(formRef.value) formRef.value.resetFields()
  formData.value = {types: [], img: '', type: null, dt: null, name: '', abstract: ''}
  modalVisible.value = true
}

async function update() {
  try {
    const values = await formRef.value.validateFields()
    formData.value = values
  } catch (e) {
    if (e?.errorFields) {
      formRef.value.setFields(e.errorFields.map(f => ({
        name: f.name,
        errors: f.errors,
      })))
    }
    return false
  }
}

async function upload(option) {
  if (option.file.size > 1024 * 1024) {
    message.error('图片大小请小于1M');
    throw Error('图片大小请小于1M');
  }
  modalLoading.value = true
  try {
    // const key = await putObjectCommon(option.file);
    // formData.value.img = publicUrl(key)
    formData.value.img = "test"
    message.success('上传成功');
  } finally {
    modalLoading.value = false
  }
}

async function query() {

}

onMounted(useLoading(loading, async () => {

}))
</script>