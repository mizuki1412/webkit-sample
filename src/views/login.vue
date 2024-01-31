<template>
  <a-spin :spinning="loading">
    <div class="_flex_col_center bg-blue-900 w-screen h-screen gap-6">
      <div class="flex">
        <div class="font-bold text-4xl text-white">{{configKit.title}}</div>
      </div>
      <div class="bg-white rounded-md shadow-md py-8 px-6 w-[300px]">
        <a-form
            :label-col="{ style: { width: '70px' } }"
            autocomplete="off"
            ref="formRef" :model="form" :rules="rule">
          <a-form-item name="username" label="账户">
            <a-input v-model:value="form.username" placeholder="用户名" @keyup.enter.native="login()">
              <template #prefix>
                <UserOutlined/>
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="pwd" label="密码">
            <a-input-password v-model:value="form.pwd" placeholder="密  码" @keyup.enter.native="login()">
              <template #prefix>
                <LockOutlined/>
              </template>
            </a-input-password>
          </a-form-item>
          <a-button size="large" class="w-full" type="primary" @click="login()">登录</a-button>
          <kit-err-channel id="login" class="mb-1" />
        </a-form>
      </div>
    </div>
  </a-spin>
</template>
<script setup>

import {ref} from "vue";
import {configKit, storeUserInfo, submitErrChanel, updateStoreUserInfo} from "../../lib/store";
import {RouteName} from "../../lib/router";
import {useRouter} from "vue-router";
import {postUserLogin} from "../../lib/api/user";
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons-vue';

const router = useRouter()
const loading = ref(false)
const form = ref({ username: '', pwd: '' });
const formRef = ref(null);
const rule = {
  username: {
    required: true,
    message: '请填写用户名',
    trigger: 'change',
  },
  pwd: [{
    required: true,
    message: '请填写密码',
    trigger: 'change',
  }, {
    min: 6,
    message: '密码长度不能小于6位',
    trigger: 'blur',
  }],
};

async function login() {
  const valid = await (formRef.value).validate();
  if(!valid) return
  submitErrChanel('login');
  const data = await postUserLogin({
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
