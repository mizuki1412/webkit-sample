<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <div class="w-full flex flex-col items-center mb-4">
      <div>欢迎</div>
      <div class="font-bold text-xl mt-1">{{ storeUserInfo.user ? storeUserInfo.user.name : '--' }}</div>
    </div>
    <div class="w-full"><el-button class="w-full" type="primary">修改密码</el-button></div>
    <div class="w-full"><el-button class="w-full" type="danger" @click="logout">退出登录</el-button></div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
import {storeUserInfo} from "../store";
import {UserLogout} from "../dao/user";
import {RouteName} from "../router";
const router = useRouter()

function logout(){
  UserLogout()
  router.push({name: RouteName.login})
}
</script>
