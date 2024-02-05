<template>
  <a-spin :spinning="loading">
    <a-button @click="show">弹出</a-button>
    <a-button @click="modal2.visible=true" class="ml-2">bug:过高时拖拽</a-button>
    <kit-modal
        id="demo1"
        :modal="modal"
        :confirm="update"
        width="50%">
      <template #title>{{ modal.data.id ? '修改' : '新增' }}课程信息</template>
      <a-form ref="form" :model="modal.data">
        <a-form-item label="题图" name="img" :rules="[{ required: true, message: '请填写' }]">
          <kit-upload :action="upload" :files="modal.data.img?[modal.data.img]:[]"></kit-upload>
        </a-form-item>
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
    <kit-modal
        id="demo2"
        :modal="modal2"
        :draggable="true"
        width="50%">
      <template #title>课程信息</template>
      <div class="h-[2000px]">1</div>
    </kit-modal>
  </a-spin>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading, useLoadingModal} from "/lib/service";
import {message} from "ant-design-vue";

const router = useRouter()
const loading = ref(false)
const form = ref()
const modal = ref({
  visible: false,
  loading: false,
  data: null
})
const modal2 = ref({
  visible: false,
  loading: false,
  data: null
})
const typeList = ref([{value: 1, name: "item1"}, {value: 2, name: "item2", text: 11}, {value: 3, name: "item3"}, {value: 4, name: "item4"}])

function show() {
  if(form.value) form.value.resetFields()
  modal.value.data = {types: []}
  console.log(modal.value.data)
  modal.value.visible = true
}

async function update() {
  console.log(modal.value.data)
  console.log(modal.value.data.dt?.valueOf())
  const valid = await form.value.validate();
  if (!valid) {
    return;
  }
}

async function upload(option) {
  if (option.file.size > 1024 * 1024) {
    message.error('图片大小请小于1M');
    throw Error('图片大小请小于1M');
  }
  await useLoadingModal(modal, async () => {
    // const key = await putObjectCommon(option.file);
    // modal.value.data.img = publicUrl(key)
    modal.value.data.img = "test"
    message.success('上传成功');
  })()
}

async function query() {

}

onMounted(useLoading(loading, async () => {

}))
</script>
