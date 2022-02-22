<template>
  <div class="flex">
    <el-upload
        v-if="!disabled"
        action=""
        list-type="picture-card"
        accept="image/png, image/jpeg"
        :http-request="action"
        :show-file-list="false">
      <template #default>
        <el-icon><plus /></el-icon>
      </template>
<!--      <template #file="{file}">-->
<!--        <img :src="file" >-->
<!--      </template>-->
    </el-upload>
    <div v-for="f in files" :key="f" style="width: 148px;height: 148px" class="_flex_center gap-0.5 ml-0.5">
      <img :src="f" alt=""/>
    </div>
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import {ref} from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'image'
  },
  action:{
    type: Function,
    default: async ()=>{}
  },
  files:{
    type: Array,
    default: ()=>[]
  },
  disabled:{
    type: Boolean,
    default: false
  }
})
</script>
