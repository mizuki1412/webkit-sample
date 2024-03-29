<template>
  <div class="h-screen w-screen overflow-hidden bg-gray-100">
    <div
        class="mb-1 flex w-full items-center justify-between shadow-md"
        :style="{
        height: headerHeight,
        backgroundColor: '#23479C',
        color: 'white',
      }"
    >
      <div
          class="flex w-1/4 cursor-pointer items-center justify-center"
          @click="routeTo('index')"
      >
        <div class="text-center">{{ configKit.title }}</div>
      </div>
      <el-menu
          :class="menuWith === '' ? 'grow' : ''"
          :style="menuWith === '' ? {} : { width: menuWith }"
          activeTextColor="#00d0FF"
          textColor="white"
          :unique-opened="true"
          :collapse-transition="false"
          backgroundColor="#23479C"
          mode="horizontal"
          :default-active="storeCurrentRoute.name"
          @select="routeTo"
      >
        <template v-for="(item, index) in storePageMenu" :key="item.name">
          <el-sub-menu
              v-if="menuItemFilter(item.children).length > 0"
              :index="item.name"
          >
            <template #title>
              <div class="flex items-center">
                <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
                <span class="ml-2">{{ item.menuTitle }}</span>
              </div>
            </template>
            <el-menu-item
                v-for="child in menuItemFilter(item.children)"
                :key="child.name"
                :index="child.name"
            >
              <template #title>
                {{ child.menuTitle }}
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item
              v-else-if="
              item.name && item.component && (!item.authFunc || item.authFunc())
            "
              :index="item.name"
          >
            <div class="flex h-full items-center justify-center">
              <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
            </div>
            <template #title>
              <span class="ml-2">{{ item.menuTitle }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="mx-4 rounded-full border border-solid border-white">
        <kit-icon
            name="common-avatar"
            class="h-7 w-7 text-white"
            @click="usercenter = true"
        ></kit-icon>
      </div>
      <el-drawer
          v-model="usercenter"
          title="个人中心"
          size="200px"
          direction="rtl"
      >
        <user-center class="text-black"/>
      </el-drawer>
    </div>
    <div
        class="w-full overflow-auto px-4 pb-4 pt-2"
        :style="{ height: 'calc(100vh - ' + headerHeight + ')' }"
    >
      <el-breadcrumb separator="/" v-if="navigator.length > 0" class="mb-4">
        <el-breadcrumb-item v-for="(item, index) in navigator"
        ><span :class="index === 1 ? 'text-blue-500' : ''">{{
            item.menuTitle
          }}</span></el-breadcrumb-item
        >
      </el-breadcrumb>
      <router-view/>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, computed} from "vue"
import {storePageMenu} from "/lib/router"
import {useRouter} from "vue-router"
import {configKit, storeCurrentRoute} from "/lib/store"
import UserCenter from "./user-center.vue"

defineProps({
  menuWith: {
    type: String,
    default: "",
  },
})

const router = useRouter()
// 顶部高
const headerHeight = ref("60px")
const usercenter = ref(false)

function routeTo(name) {
  router.push({name})
}

// menu
function menuItemFilter(itemChildren) {
  if (!itemChildren) itemChildren = []
  return itemChildren.filter((child) => !child.authFunc || child.authFunc())
}

const navigator = computed(() => {
  // {name, menuTitle}
  const navigatorArray = []
  for (let e of storePageMenu) {
    if (!e.children || e.children.length === 0) continue
    for (let ee of e.children) {
      if (storeCurrentRoute.name === ee.name) {
        navigatorArray.push(e)
        navigatorArray.push(ee)
      }
    }
  }
  return navigatorArray
})

onMounted(() => {
})
</script>
<style>
.el-menu--horizontal {
  border-bottom-width: 0;
}
</style>
