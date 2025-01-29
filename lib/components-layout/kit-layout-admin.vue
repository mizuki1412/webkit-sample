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
                v-if="menuItemFilter(item.children).length > 0"
                :key="item.name" :title="item.menuTitle">
              <template #icon>
                <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
              </template>
              <a-menu-item
                  v-for="child in menuItemFilter(item.children)"
                  :key="child.name" :title="child.menuTitle">
                <span>{{child.menuTitle}}</span>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item
                v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
                :key="item.name" :title="item.menuTitle">
              <kit-icon class="w-4 h-4" :name="item.menuIcon"></kit-icon>
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
        <a-drawer
            v-model:open="usercenter"
            title="个人中心"
            width="300"
            placement="right"
        >
          <user-center/>
        </a-drawer>
      </a-layout-header>
      <a-layout-content class="overflow-auto p-2" :style="{height: 'calc(100vh - 64px)'}">
        <div class="w-full min-h-full bg-white p-2 rounded-sm">
          <router-view/>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import {ref, onMounted, computed, watch} from "vue"
import {RouteMetaKey, storePageMenu} from "/lib/router"
import {useRouter} from "vue-router"
import {configKit, storeCurrentRoute} from "/lib/store"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import UserCenter from "./user-center.vue"

const router = useRouter()
// 顶部高
// const headerHeight = ref("64px")
const isCollapse = ref(false)
const usercenter = ref(false)

const selectedKeys = ref([])
const openKeys = ref([])
const preOpenKeys = ref([])
watch(openKeys, (_val, oldVal) => {preOpenKeys.value = oldVal});
watch(()=>storeCurrentRoute.name, ()=>{
  selectedKeys.value = [storeCurrentRoute.meta[RouteMetaKey.parentName] ||storeCurrentRoute.name]
})

function routeTo(name) {
  router.push({name})
}

function tap(item){
  routeTo(item.key)
}

function menuChange() {
  const element = document.getElementById("home_page")
  setCollapse(element.offsetWidth < 1200)
}

function setCollapse(collapse) {
  isCollapse.value = collapse
  openKeys.value = isCollapse.value ? [] : preOpenKeys.value
}

// menu
function menuItemFilter(itemChildren) {
  if (!itemChildren) itemChildren = []
  return itemChildren.filter((child) => !child.authFunc || child.authFunc())
}

onMounted(() => {
  menuChange()
  // 初始化选中的menu项
  selectedKeys.value = [storeCurrentRoute.meta[RouteMetaKey.parentName] ||storeCurrentRoute.name]
  // 初始化选中的组
  openKeys.value = []
  for (let item of storePageMenu){
    if(menuItemFilter(item.children).filter((x)=>x.name===selectedKeys.value[0]).length>0){
      openKeys.value = [item.name]
      break
    }
  }
  // window.onresize = menuChange
})
</script>
