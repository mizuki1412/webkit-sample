<template>
  <form-create v-model="formData" :option="options" v-model:api="formApi" :rule="formRules" />
</template>
<script setup>
import {ref, onMounted} from "vue"
const formData = ref({});
const formApi = ref(null);
const options = ref({
  preview: false,
  // 表单提交事件
  onSubmit: function (formData) {
    formData.uploads = JSON.parse(sessionStorage.getItem("upload-upload1"))
    alert(JSON.stringify(formData))
  }
});
const formRules = ref([
  {
    type: 'input',
    field: 'username',
    title: '用户名',
    value: '',
  },
  {
    "type": "upload",
    "field": "upload1",
    "title": "上传",
    "info": "",
    "$required": false,
    "props": {
      "action": "https://httpbin.org/post",
      // // 感觉有bug，导致name等设置不了，回显有问题，throw后可以恢复原默认回显; 骚操作：用sessionStorage存
      "onSuccess": "$FNX:const file = $inject.args[0];\nconst files = $inject.args[1];\nsessionStorage.setItem('upload-upload1', JSON.stringify(files.map(x=>x.uid)));\nthrow new Error();",
      "multiple": true,
      "listType": "picture",
      "withCredentials": true,
      "maxCount": 3,
    },
    // "value": [{name:'文件1.pdf', url: 'http://form-create.com/logo.png'},{name:'文件2.pdf', url: 'http://form-create.com/logo.png'}],
    "display": true,
    "hidden": false,
    "_fc_drag_tag": "upload"
  }
]);
onMounted(async () => {
  const keysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith("upload-")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => sessionStorage.removeItem(key));
})
</script>
