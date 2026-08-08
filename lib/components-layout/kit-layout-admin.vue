<template>
  <a-layout id="home_page">
    <a-layout-sider v-model:collapsed="isCollapse" :trigger="null" collapsible>
      <div class="text-white text-center cursor-pointer h-[64px] _flex_center text-lg" @click="routeTo('index')">
        {{ isCollapse?configKit.titleSimple:configKit.title }}
      </div>
      <div class="overflow-auto no-scrollbar" :style="{height: 'calc(100vh - 64px)'}">
        <a-menu
            :collapsed="isCollapse"
            theme="dark"
            mode="inline"
            @click="tap"
            v-model:openKeys="openKeys"
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
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" class="w-full flex items-center justify-between">
        <a-button type="text" size="large" @click="setCollapse(!isCollapse)">
          <MenuUnfoldOutlined v-if="isCollapse" />
          <MenuFoldOutlined v-else />
        </a-button>
        <a-button type="text" size="large" @click="usercenter = true" class="mr-2">
          <UserOutlined />
        </a-button>
      </a-layout-header>
      <a-layout-content class="overflow-auto p-2" :style="{height: 'calc(100vh - 64px)'}">
        <div class="w-full min-h-full bg-white p-2 rounded-sm">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
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
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@antdv-next/icons';
import UserCenter from "./user-center.vue"

const router = useRouter()
const isCollapse = ref(false)
const usercenter = ref(false)
const selectedKeys = ref([])
const openKeys = ref([])

watch(() => storeCurrentRoute.name, () => {
  selectedKeys.value = [storeCurrentRoute.meta[RouteMetaKey.parentName] || storeCurrentRoute.name]
}, { immediate: true })

const preOpenKeys = ref([])
watch(openKeys, (_val, oldVal) => { preOpenKeys.value = oldVal })

watch(selectedKeys, (keys) => {
  if (!keys[0]) return
  const parent = storePageMenu.find(item =>
    visibleChildren(item).some(child => child.name === keys[0])
  )
  if (parent && !openKeys.value.includes(parent.name)) {
    openKeys.value = [parent.name]
  }
})

function routeTo(name) {
  router.push({name})
}

function tap(item) {
  routeTo(item.key)
}

function setCollapse(collapse) {
  isCollapse.value = collapse
  openKeys.value = collapse ? [] : preOpenKeys.value
}

function visibleChildren(item) {
  return (item.children || []).filter(child => !child.authFunc || child.authFunc())
}
</script>