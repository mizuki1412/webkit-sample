<template>
    <a-config-provider :locale="zhCn" :theme="antdTheme">
        <a-app>
            <router-view />
        </a-app>
    </a-config-provider>
</template>
<script setup>
import zhCn from 'antdv-next/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { antdTheme } from './design/registry';
dayjs.locale('zh-cn');
</script>
