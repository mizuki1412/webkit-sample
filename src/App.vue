<template>
  <a-config-provider :locale="zhCn" :theme="designTheme">
    <a-app>
      <router-view/>
      <!-- 设计语言切换器（sample 专属；web-frame 保持 UI 无关核心层） -->
      <design-switcher/>
    </a-app>
  </a-config-provider>
</template>
<script setup>
import zhCn from 'antdv-next/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import DesignSwitcher from './design/design-switcher.vue';
import {useDesignTheme} from './design/use-design-theme';
dayjs.locale('zh-cn');

// 设计语言切换：<html data-design> 驱动 CSS 变量级联，ConfigProvider theme 驱动 antd 组件
const {designTheme} = useDesignTheme();
</script>
