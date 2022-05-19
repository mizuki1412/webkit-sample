<template>
  <div class="flex">
    <el-upload
        v-if="!disabled"
        action=""
        list-type="picture-card"
        :accept="accept"
        :http-request="action"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRm"
    >
      <el-icon>
        <plus/>
      </el-icon>
    </el-upload>
    <!--    <div v-for="f in files" :key="f" class="_flex_center ml-1 gap-0.5">-->
    <!--      <img :src="f" alt="" :style="{ maxHeight: fileMaxHeight + 'px' }" />-->
    <!--    </div>-->
    <el-dialog v-model="modal.visible">
      <img :src="modal.data" alt="Preview Image"/>
    </el-dialog>
  </div>
</template>
<script setup>
import {Plus} from "@element-plus/icons-vue"
import {onMounted, ref, watch} from "vue"
import _ from 'lodash'

/**
 * action demo:
 * async function parseJson(option){
 *   if (option.file.size > 1024 * 1024) {
 *     ElMessage.error('图片大小请小于1M');
 *     throw Error('图片大小请小于1M');
 *   }
 *   await useLoadingModal(modal, async ()=>{
 *     const key = await putObjectCommon(option.file);
 *     modal.value.data.img = publicUrl(key)
 *     ElMessage.success('上传成功');
 *   })()
 * }
 */

const props = defineProps({
  action: {
    type: Function,
    default: async () => {
    },
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
const fileList = ref([])
const modal = ref({
  visible: false,
  data: null
})

const updateFiles = _.debounce(() => {
  fileList.value = []
  if (!props.files) return
  for (let e of props.files) {
    if(e){
      fileList.value.push({
        url: e
      })
    }
  }
}, 300, {leading: true, trailing: false})

watch(() => props.files, updateFiles)
onMounted(updateFiles)

const handlePictureCardPreview = (uploadFile) => {
  modal.value = {visible: true, data: uploadFile.url}
}
const handleRm = (uploadFile) => {
  _.remove(props.files, (n) => n === uploadFile.url)
}
</script>
