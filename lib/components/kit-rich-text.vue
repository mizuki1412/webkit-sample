<template>
  <div v-loading="loading">
    <Editor
        :api-key="configKit.tinymceApiKey"
        :disabled="disabled"
        ref="editor"
        v-model="content"
        :init="option"/>
  </div>
</template>
<script setup>
import Editor from '@tinymce/tinymce-vue';
import {onMounted, ref, watch} from "vue";
import {publicUrl, putObjectCommon} from "../service3/oss/oss-helper";
import {useLoading} from "../service";
import {configKit} from "../store";
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled:{
    type: Boolean,
    default: false
  }
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

watch(() => props.modelValue, function() {
  if (props.modelValue !== content.value) {
    content.value = props.modelValue;
  }
});
watch(content, function() {
  if (content.value !== props.modelValue) {
    emit('update:modelValue', content.value);
  }
});
// 初始化时赋值, editor需要等待初始化完成
async function checkInit() {
  if (editor.value.editor && editor.value.editor.initialized) {
    editor.value.editor.setContent(props.modelValue);
  } else {
    console.log("tinymce init error", editor.value)
    setTimeout(checkInit, 1000);
  }
}
onMounted(useLoading(loading, async () => {
  // await checkInit();
  content.value = props.modelValue;
}));
</script>
<style>
.tox-tinymce-aux{
  z-index: 9999!important;
}
</style>
