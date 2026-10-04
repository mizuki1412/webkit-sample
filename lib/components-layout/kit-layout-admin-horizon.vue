<template>
  <a-layout id="home_page">
    <a-layout-header class="!p-0 w-full flex items-center justify-between" :style="{ height: headerHeight, lineHeight: headerHeight, background: '#001529' }">
      <div class="text-white text-center cursor-pointer h-full flex items-center px-6 text-lg shrink-0" @click="routeTo('index')">
        {{ configKit.title }}
      </div>
      <a-menu
          class="flex-1 min-w-0"
          theme="dark"
          mode="horizontal"
          @click="tap"
          v-model:selectedKeys="selectedKeys">
        <template v-for="(item, index) in storePageMenu" :key="index">
          <a-sub-menu
              v-if="visibleChildren(item).length > 0"
              :key="item.name" :title="item.menuTitle">
            <template #icon>
              <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
            </template>
            <a-menu-item
                v-for="child in visibleChildren(item)"
                :key="child.name" :title="child.menuTitle">
              <span>{{child.menuTitle}}</span>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item
              v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
              :key="item.name" :title="item.menuTitle">
            <template #icon>
              <kit-icon class="w-4 h-4" :name="item.menuIcon"></kit-icon>
            </template>
            <span>{{item.menuTitle}}</span>
          </a-menu-item>
        </template>
      </a-menu>
      <a-button type="text" size="large" @click="usercenter = true" class="mr-2 shrink-0">
        <UserOutlined />
      </a-button>
    </a-layout-header>
    <a-layout-content class="overflow-auto p-2" :style="{height: 'calc(100vh - ' + headerHeight + ')'}">
      <div class="w-full min-h-full bg-white p-2 rounded-sm">
        <router-view/>
      </div>
    </a-layout-content>
  </a-layout>
  <a-drawer
      v-model:open="usercenter"
      title="个人中心"
      size="300"
      placement="right">
    <user-center/>
  </a-drawer>
</template>
<script setup>
import {ref, watch} from "vue"
import {RouteMetaKey, storePageMenu} from "/lib/router"
import {useRouter} from "vue-router"
import {configKit, storeCurrentRoute} from "/lib/store"
import {UserOutlined} from '@antdv-next/icons';
import UserCenter from "./user-center.vue"

const router = useRouter()
// 顶部菜单栏高度
const headerHeight = ref("48px")
const usercenter = ref(false)
const selectedKeys = ref([])

watch(() => storeCurrentRoute.name, () => {
  selectedKeys.value = [storeCurrentRoute.meta[RouteMetaKey.parentName] || storeCurrentRoute.name]
}, { immediate: true })

function routeTo(name) {
  router.push({name})
}

function tap(item) {
  routeTo(item.key)
}

function visibleChildren(item) {
  return (item.children || []).filter(child => !child.authFunc || child.authFunc())
}
</script>
<style scoped>
/* 顶部水平菜单默认行高为 64px，需与菜单栏高度保持一致 */
:deep(.ant-menu-horizontal) {
  line-height: 46px;
}
</style>