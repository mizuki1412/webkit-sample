<template>
  <div class="flex">
    <el-upload
      v-if="!disabled"
      action=""
      list-type="picture-card"
      :accept="accept"
      :http-request="action"
      :show-file-list="false"
    >
      <template #default>
        <el-icon>
          <plus />
        </el-icon>
      </template>
      <!--      <template #file="{file}">-->
      <!--        <img :src="file" >-->
      <!--      </template>-->
    </el-upload>
    <div v-for="f in files" :key="f" class="_flex_center ml-1 gap-0.5">
      <img :src="f" alt="" :style="{ maxHeight: fileMaxHeight + 'px' }" />
    </div>
  </div>
</template>
<script setup>
import { Plus } from "@element-plus/icons-vue"
import { ref } from "vue"

const props = defineProps({
  action: {
    type: Function,
    default: async () => {},
  },
  accept: {
    type: String,
    default: "image/png, image/jpeg",
  },
  files: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fileMaxHeight: {
    type: Number,
    default: 148,
  },
})
</script>
