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
    <a-modal v-model="modal.visible">
      <img :src="modal.data" alt="Preview Image"/>
    </a-modal>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue"
import { PlusOutlined, LoadingOutlined } from '@antdv-next/icons';
import {useLoading} from "../service";

const emit = defineEmits(['update:files'])

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
})
const fileList = ref([])
const modal = ref({
  visible: false,
  data: null
})
const loading = ref(false)

watch(() => props.files, () => {
  fileList.value = (props.files || []).filter(e => e).map(e => ({ url: e }))
}, { immediate: true })

const handlePictureCardPreview = (uploadFile) => {
  modal.value = {visible: true, data: uploadFile.url}
}
const handleRm = (uploadFile) => {
  emit('update:files', props.files.filter(n => n !== uploadFile.url))
}

const customAction = useLoading(loading, props.action)
</script>
