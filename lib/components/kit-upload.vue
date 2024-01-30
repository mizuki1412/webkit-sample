<template>
  <div class="flex">
    <a-upload
        list-type="picture-card"
        :accept="accept"
        :custom-request="customAction"
        :disabled="disabled"
        :file-list="fileList"
        @preview="handlePictureCardPreview"
        @remove="handleRm"
    >
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
    </a-upload>
    <!--    <div v-for="f in files" :key="f" class="_flex_center ml-1 gap-0.5">-->
    <!--      <img :src="f" alt="" :style="{ maxHeight: fileMaxHeight + 'px' }" />-->
    <!--    </div>-->
    <a-modal v-model="modal.visible">
      <img :src="modal.data" alt="Preview Image"/>
    </a-modal>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue"
import _ from 'lodash'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import {useLoading, useLoadingObject} from "../service";

/**
 * action demo:
 * async function parseJson(option){
 *   if (option.file.size > 1024 * 1024) {
 *     message.error('图片大小请小于1M');
 *     throw Error('图片大小请小于1M');
 *   }
 *   await useLoadingModal(modal, async ()=>{
 *     const key = await putObjectCommon(option.file);
 *     modal.value.data.img = publicUrl(key)
 *     message.success('上传成功');
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
const loading = ref(false)

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

const customAction = useLoading(loading, props.action)
</script>
