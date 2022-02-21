<template>
  <div v-loading="loading">
    <Editor
        ref="editor"
        v-model="content"
        :init="option"
    />
  </div>
</template>
<script setup>
import Editor from '@tinymce/tinymce-vue';
import {onMounted, ref, watch} from "vue";
import {publicUrl, putObjectCommon} from "../service3/oss/oss-helper";
import {useLoading} from "../service";
const props = defineProps({
  modalValue: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])

const loading = ref(false);
const content = ref();
const editor = ref();
const option = ref({
  height: 500,
  menubar: false,
  branding: false, // 隐藏右下角技术支持
  plugins: 'print preview importcss searchreplace autolink autosave save directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
  language: 'zh_CN',
  // language_url: process.env.BASE_URL + 'tinymce/langs/zh_CN.js',
  // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | charmap emoticons | fullscreen  preview | insertfile image media link anchor | a11ycheck',
  // https://www.tiny.cloud/docs/api/tinymce/tinymce.editor/#setcontent
  toolbar: 'undo redo | bold italic underline strikethrough | fontselect | fontsizeselect | formatselect | alignleft aligncenter| outdent indent| forecolor backcolor casechange permanentpen formatpainter removeformat| insertfile image link anchor | a11ycheck',
  async images_upload_handler(blobInfo, success, failure) {
    const key = await putObjectCommon(blobInfo.blob());
    success(await publicUrl(key));
  },
});

watch(() => props.modalValue, function() {
  if (props.modalValue !== content.value) {
    editor.value.editor.setContent(props.modalValue || '');
    content.value = props.modalValue;
  }
});
watch(content, function() {
  if (content.value !== props.modalValue) {
    emit('update:modelValue', content.value);
  }
});
// 初始化时赋值, editor需要等待初始化完成 todo
async function checkInit() {
  if (editor.value.editor && editor.value.editor.initialized) {
    editor.value.editor.setContent(props.modalValue);
  } else {
    setTimeout(checkInit, 1000);
  }
}
onMounted(useLoading(loading, async () => {
  await checkInit();
}));
</script>
<style>
.tox-tinymce-aux{
  z-index: 9999!important;
}
</style>
