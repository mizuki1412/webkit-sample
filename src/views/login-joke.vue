<template>
  <a-spin :spinning="loading">
    <div class="_flex_col_center bg-blue-900 w-screen h-screen gap-6">
      <div class="flex">
        <div class="font-bold text-4xl text-white">login joke</div>
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
          <a-button size="large" class="w-full" type="primary" ref="btnRef" :style="btnStyle" @click="login()">登录</a-button>
          <kit-err-channel id="login" class="mb-1" />
        </a-form>
      </div>
    </div>
  </a-spin>
</template>
<script setup>

import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import {configKit} from "../../lib/store";
import {LockOutlined, UserOutlined} from "@ant-design/icons-vue";

const router = useRouter()
const loading = ref(false)
const form = ref({ username: null, pwd: null });
const formRef = ref(null);
const btnRef = ref(null);
const btnStyle = ref({
  transform: 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)',
  boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.15)',
  // pointerEvents: 'auto'
})
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

function login(){
  console.log("login")
}

const distanceBetween = (p1x, p1y, p2x, p2y) => {
  const dx = p1x - p2x
  const dy = p1y - p2y
  return Math.sqrt(dx * dx + dy * dy)
}

onMounted(()=>{
  document.addEventListener('mousemove', (event) => {
    if (form.value.username && form.value.pwd) {
      btnStyle.value.transform = `translate(0px, 0px) rotateX(0deg) rotateY(0deg)`
      btnStyle.value.boxShadow = `0px 0px 0px rgba(0, 0, 0, 0.15)`
      // btnStyle.value.pointerEvents = 'auto'
      return
    }
    // 获取组件的offset
    const bx = btnRef.value.$el.offsetLeft + btnRef.value.$el.offsetWidth / 2
    const by =  btnRef.value.$el.offsetTop + btnRef.value.$el.offsetHeight / 2
    const dist = distanceBetween(event.clientX, event.clientY, bx, by) * 2
    const angle = Math.atan2(event.clientY - by, event.clientX - bx)
    // 椭圆半径公式
    const radius = Math.sqrt(Math.pow(btnRef.value.$el.offsetWidth + 20, 2) * Math.pow(Math.cos(angle), 2) + Math.pow(btnRef.value.$el.offsetHeight + 20, 2) * Math.pow(Math.sin(angle), 2))
    const ox = -1 * Math.cos(angle) * (Math.max((radius - dist) / 2, 0))
    const oy = -1 * Math.sin(angle) * (Math.max((radius - dist) / 2, 0))
    const rx = oy / 2
    const ry = -ox / 2
    btnStyle.value.transform = `translate(${ox}px, ${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`
    btnStyle.value.boxShadow = `0px ${Math.abs(oy)}px ${Math.abs(oy) / radius * 40}px rgba(0, 0, 0, 0.15)`
    // btnStyle.value.pointerEvents = 'none'
  })
})
</script>
