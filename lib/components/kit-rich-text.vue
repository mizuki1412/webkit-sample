<template>
  <a-spin :spinning="loading">
    <Editor
        :disabled="disabled"
        ref="editor"
        v-model="modelValue"
        :init="option"
    />
  </a-spin>
</template>
<script setup>
import Editor from "@tinymce/tinymce-vue"
import {onMounted, ref} from "vue"
import {publicUrl, putObjectCommon} from "../service3/oss/oss-helper"
import {configKit} from "../store"

import tinymce from 'tinymce/tinymce'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/models/dom'

import 'tinymce/plugins/accordion'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

const modelValue = defineModel()
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const loading = ref(false)
const content = ref()
const editor = ref()
const option = ref({
  height: 500,
  menubar: true,
  branding: false, // 隐藏右下角技术支持
  promotion: false, // 右上角升级
  plugins: "accordion advlist anchor autolink autoresize autosave charmap code codesample directionality emoticons fullscreen image importcss insertdatetime link lists media nonbreaking pagebreak preview quickbars save searchreplace table visualblocks visualchars wordcount",
  language_url: configKit.assetsBaseUrl + 'tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  // https://www.tiny.cloud/docs/tinymce/latest/available-menu-items/
  // menu: {
  //   file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
  //   edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
  //   view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
  //   insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
  //   format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
  //   tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
  //   table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
  // },
  toolbar_mode: 'sliding',
  toolbar: 'blocks fontfamily fontsize align lineheight | bold forecolor backcolor | removeformat',

  async images_upload_handler(blobInfo, success, failure) {
    const key = await putObjectCommon(blobInfo.blob())
    success(await publicUrl(key))
  },
})

// 初始化时赋值, editor需要等待初始化完成
async function checkInit() {
  if (editor.value.editor && editor.value.editor.initialized) {
    editor.value.editor.setContent(modelValue.value)
  } else {
    console.error("tinymce init error", editor.value)
    setTimeout(checkInit, 1000)
  }
}

</script>
<style>
.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>
