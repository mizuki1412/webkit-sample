<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="mb-4 flex w-full flex-col items-center">
      <div>欢迎</div>
      <div class="mt-1 text-xl font-bold">
        {{ storeUserInfo.user ? storeUserInfo.user.name : "--" }}
      </div>
    </div>
    <div class="w-full">
      <a-button class="w-full" type="primary" @click="showUpdatePwd">修改密码</a-button>
    </div>
    <div class="w-full">
      <a-button class="w-full" @click="logout">退出登录</a-button>
    </div>
    <kit-modal
        v-model:visible="pwdVisible"
        width="400px"
        :confirm="updatePwd">
      <template #title>账户密码修改</template>
      <a-form
          ref="form"
          autocomplete="off"
          :model="pwdForm"
          v-if="pwdForm">
        <a-form-item
            label="原密码"
            name="oldPwd"
            :rules="[{ required: true, message: '请填写密码' }]">
          <a-input-password allow-clear v-model:value="pwdForm.oldPwd"/>
        </a-form-item>
        <a-form-item
            label="新密码"
            name="newPwd"
            :rules="[
            { required: true, message: '请填写密码' },
            { type: 'string', min: 6, message: '密码长度不能小于6位' },
          ]">
          <a-input-password allow-clear v-model:value="pwdForm.newPwd"/>
        </a-form-item>
        <a-form-item
            label="确认密码"
            name="pwdCheck"
            :rules="[{ required: true, validator: passwordCheck }]">
          <a-input-password allow-clear v-model:value="pwdForm.pwdCheck"/>
        </a-form-item>
      </a-form>
    </kit-modal>
  </div>
</template>
<script setup>
import {ref} from "vue"
import {useRouter} from "vue-router"
import {storeUserInfo} from "../store"
import {getUserLogout, postUserUpdatePwd} from "../api/user"
import {RouteName} from "../router"
import {message} from "antdv-next";

const router = useRouter()
const pwdVisible = ref(false)
const pwdForm = ref(null)
const passwordLoading = ref(false)
const form = ref()

let props = defineProps({
  beforeLogout: {
    type: Function,
    default: async () => {
    },
  },
})

function passwordCheck(rule, value, callback) {
  if (!value && pwdForm.value.newPwd && pwdForm.value.newPwd !== "") {
    callback(new Error("请再次输入密码"))
  } else if (value !== pwdForm.value.newPwd) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}

function showUpdatePwd() {
  pwdForm.value = {oldPwd: '', newPwd: '', pwdCheck: ''}
  pwdVisible.value = true
}

async function updatePwd() {
  try {
    await form.value.validateFields()
  } catch (e) {
    if (e?.errorFields) {
      form.value.setFields(e.errorFields.map(f => ({
        name: f.name,
        errors: f.errors,
      })))
    }
    return false
  }
  passwordLoading.value = true
  try {
    await postUserUpdatePwd({
      oldPwd: pwdForm.value.oldPwd,
      newPwd: pwdForm.value.newPwd,
    })
    message.success("修改成功")
    pwdVisible.value = false
  } finally {
    passwordLoading.value = false
  }
}

async function logout() {
  // todo global loading
  await props.beforeLogout()
  await getUserLogout()
  await router.push({name: RouteName.login})
}
</script>
