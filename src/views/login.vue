<template>
  <div class="_flex_col_center bg-blue-900 w-screen h-screen" v-loading="loading">
    <div class="flex">
      <div class="font-bold text-4xl text-white">{{configKit.title}}</div>
    </div>
    <div class="bg-white rounded-md shadow-md py-8 px-6 mt-4 w-[300px]">
      <el-form
          label-width="70px"
          class="flex flex-col justify-around" ref="formRef" :model="form" :rules="rule">
        <el-form-item prop="username" label="账户：">
          <el-input v-model="form.username" autofocus autocomplete="off" placeholder="用户名" @keyup.enter.native="login()" />
        </el-form-item>
        <el-form-item prop="pwd" label="密码：">
          <el-input type="password" autocomplete="off" v-model="form.pwd" placeholder="密  码" @keyup.enter.native="login()" />
        </el-form-item>
        <el-button size="large" class="w-full" type="primary" @click="login()">登录</el-button>
        <kit-err-channel id="login" class="mb-1" />
      </el-form>
    </div>
  </div>
</template>
<script setup>

import {ref} from "vue";
import {configKit, storeUserInfo, submitErrChanel, updateStoreUserInfo} from "../../lib/store";
import {RouteName} from "../../lib/router";
import {useRouter} from "vue-router";
import {UserLogin} from "../../lib/api/user";

const router = useRouter()
const loading = ref(false)
const form = ref({ username: '', pwd: '' });
const formRef = ref(null);
const rule = {
  username: {
    required: true,
    message: '请填写用户名',
    trigger: 'none',
  },
  pwd: [{
    required: true,
    message: '请填写密码',
    trigger: 'none',
  }, {
    type: 'string',
    min: 6,
    message: '密码长度不能小于6位',
    trigger: 'none',
  }],
};

async function login() {
  const valid = await (formRef.value).validate();
  if(!valid) return
  submitErrChanel('login');
  const data = await UserLogin({
    ...form.value,
    schema:configKit.schema,
  });
  updateStoreUserInfo(data);
  const redirect = {
    name: RouteName.index,
    query: {},
  };
  if (
      storeUserInfo.redirect &&
      storeUserInfo.redirect.name &&
      storeUserInfo.redirect.name !== 'notFound' &&
      storeUserInfo.redirect.name !== RouteName.login
  ) {
    redirect.name = storeUserInfo.redirect.name;
    redirect.query = storeUserInfo.redirect.query;
  }
  storeUserInfo.redirect = redirect;
  router.push(redirect);
}
</script>
