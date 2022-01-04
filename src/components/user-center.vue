<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <div class="w-full text-center mb-4">欢迎，<span class="font-bold text-xl">{{ storeUserInfo.user ? storeUserInfo.user.name : '--' }}</span></div>
    <div class="w-full"><el-button class="w-full" type="primary">修改密码</el-button></div>
    <div class="w-full"><el-button class="w-full" type="danger" @click="logout">退出登录</el-button></div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
import {storeUserInfo} from "../../lib/store";
import {RouteName} from "../../lib/router";
import {UserLogout} from "../../lib/dao/user";
const router = useRouter()

function logout(){
  UserLogout()
  router.push({name: RouteName.login})
}
</script>
