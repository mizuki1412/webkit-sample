<template>
  <a-config-provider :locale="zhCn">
    <router-view/>
  </a-config-provider>
</template>
<script setup>
import zhCn from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
</script>
