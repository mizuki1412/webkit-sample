<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="mb-4 flex w-full flex-col items-center">
      <div>欢迎</div>
      <div class="mt-1 text-xl font-bold">
        {{ storeUserInfo.user ? storeUserInfo.user.name : "--" }}
      </div>
    </div>
    <div class="w-full">
      <el-button class="w-full" type="primary" @click="showUpdatePwd"
      >修改密码
      </el-button
      >
    </div>
    <div class="w-full">
      <el-button class="w-full" type="danger" @click="logout"
      >退出登录
      </el-button
      >
    </div>
    <kit-modal
        id="update-pwd"
        :modal="modal"
        width="400px"
        :confirm="updatePwd"
    >
      <template #title>账户密码修改</template>
      <el-form
          ref="form"
          label-width="100px"
          :model="modal.data"
          v-if="modal.data"
      >
        <el-form-item
            label="原密码："
            prop="oldPwd"
            :rules="[{ required: true, message: '请填写密码' }]"
        >
          <el-input
              clearable
              v-model="modal.data.oldPwd"
              type="password"
              autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item
            label="新密码："
            prop="newPwd"
            :rules="[
            { required: true, message: '请填写密码' },
            { type: 'string', min: 6, message: '密码长度不能小于6位' },
          ]"
        >
          <el-input
              clearable
              v-model="modal.data.newPwd"
              type="password"
              autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item
            label="确认密码："
            prop="pwdCheck"
            :rules="[{ required: true, validator: passwordCheck }]"
        >
          <el-input clearable v-model="modal.data.pwdCheck" type="password"/>
        </el-form-item>
      </el-form>
    </kit-modal>
  </div>
</template>
<script setup>
import {ref} from "vue"
import {useRouter} from "vue-router"
import {storeUserInfo} from "../store"
import {getUserLogout, postUserUpdatePwd} from "../api/user"
import {RouteName} from "../router"
import {useLoadingModal} from "../service"
import {ElMessage} from "element-plus"

const router = useRouter()
const modal = ref({
  visible: false,
  loading: false,
  data: null,
})
const form = ref()

let props = defineProps({
  beforeLogout: {
    type: Function,
    default: async () => {
    },
  },
})

function passwordCheck(rule, value, callback) {
  if (!value && modal.value.data.newPwd && modal.value.data.newPwd !== "") {
    callback(new Error("请再次输入密码"))
  } else if (value !== modal.value.data.newPwd) {
    callback(new Error("两次输入密码不一致!"))
  } else {
    callback()
  }
}

function showUpdatePwd() {
  modal.value = {
    visible: true,
    data: {},
  }
}

async function updatePwd() {
  const valid = await form.value.validate()
  if (!valid) return
  await useLoadingModal(modal, async () => {
    await postUserUpdatePwd({
      oldPwd: modal.value.data.oldPwd,
      newPwd: modal.value.data.newPwd,
    })
    ElMessage.success("修改成功")
    modal.value.visible = false
  })()
}

async function logout() {
  // todo global loading
  await props.beforeLogout()
  await getUserLogout()
  await router.push({name: RouteName.login})
}
</script>
