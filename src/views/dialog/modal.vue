<template>
  <div v-loading="loading">
    <el-button @click="show">弹出</el-button>
    <el-button @click="modal2.visible=true">bug:过高时拖拽</el-button>
    <kit-modal
        id="demo1"
        :modal="modal"
        :confirm="update"
        width="50%">
      <template #title>{{ modal.data.id ? '修改' : '新增' }}课程信息</template>
      <el-form ref="form" label-width="100px" :model="modal.data" v-loading="modal.loading">
        <el-form-item label="题图：" prop="img" :rules="[{ required: true, message: '请填写' }]">
          <kit-upload :action="upload" :files="modal.data.img?[modal.data.img]:[]"></kit-upload>
        </el-form-item>
        <el-form-item label="课程分类：" prop="type" :rules="{ required: true, message: '请选择' }">
          <el-select v-model="modal.data.types" multiple clearable filterable>
            <el-option v-for="e in typeList" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类：" prop="type" :rules="{ required: true, message: '请选择' }">
          <el-select v-model="modal.data.type" clearable filterable>
            <el-option v-for="e in typeList" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：" prop="dt">
          <el-date-picker clearable v-model="modal.data.dt"/>
        </el-form-item>
        <el-form-item label="标题：" prop="name" :rules="[{ required: true, message: '请填写' }]">
          <el-input clearable v-model="modal.data.name"/>
        </el-form-item>
        <el-form-item label="简介：" prop="abstract" :rules="{ required: true, message: '请填写' }">
          <el-input type="textarea" clearable v-model="modal.data.abstract"/>
        </el-form-item>
      </el-form>
    </kit-modal>
    <kit-modal
        id="demo2"
        :modal="modal2"
        :draggable="true"
        width="50%">
      <template #title>课程信息</template>
      <div class="h-[2000px]">1</div>
    </kit-modal>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {useLoading, useLoadingModal} from "/lib/service";
import {ElMessage, ElMessageBox} from "element-plus";

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
const typeList = ref([{id: 1, name: "item1"}, {id: 2, name: "item2"}, {id: 3, name: "item3"}, {id: 4, name: "item4"}])

function show() {
  modal.value.data = {types: []}
  modal.value.visible = true
}

async function update() {
  const valid = await form.value.validate();
  if (!valid) {
    return;
  }
  console.log("modal confirm")
}

async function upload(option) {
  if (option.file.size > 1024 * 1024) {
    ElMessage.error('图片大小请小于1M');
    throw Error('图片大小请小于1M');
  }
  await useLoadingModal(modal, async () => {
    // const key = await putObjectCommon(option.file);
    // modal.value.data.img = publicUrl(key)
    ElMessage.success('上传成功');
  })()
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

async function query() {

}

onMounted(useLoading(loading, async () => {

}))
</script>
