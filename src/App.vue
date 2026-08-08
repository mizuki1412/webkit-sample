<template>
  <a-config-provider :locale="zhCn">
    <a-app>
      <router-view/>
    </a-app>
  </a-config-provider>
</template>
<script setup>
import zhCn from 'antdv-next/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
</script>