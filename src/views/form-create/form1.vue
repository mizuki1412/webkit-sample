<template>
    <fc-designer ref="designer" height="100vh" />
</template>
<script setup>
import { ref, onMounted } from "vue"
// form-create 只在本页引入：整库不进首屏主包
import formCreate from "@form-create/antdv-next"
import { getCurrentInstance } from "vue"

// 组件在模板中使用前需注册到当前 app
// eslint-disable-next-line vue/prefer-import-from-vue
const app = getCurrentInstance().appContext.app
if (!app._context.components["FcDesigner"] && !app._context.components["form-create"]) {
    app.use(formCreate)
}

onMounted(async () => {

})
</script>
