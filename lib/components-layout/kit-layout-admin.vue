<template>
  <div class="flex h-screen w-screen" id="home_page">
    <div :style="{ width: menuWidth }">
      <el-menu
          :collapse="isCollapse"
          class="h-screen"
          activeTextColor="#00d0FF"
          textColor="white"
          :unique-opened="true"
          :collapse-transition="false"
          backgroundColor="#23479C"
          mode="vertical"
          :default-active="storeCurrentRoute.name"
          @select="routeTo"
      >
        <div
            class="flex cursor-pointer items-center justify-center bg-blue-900 p-2 text-white shadow-md"
            @click="routeTo('index')"
            :style="{ height: headerHeight }"
        >
          <div v-if="!isCollapse" class="text-center">
            {{ configKit.title }}
          </div>
          <div v-else class="text-center">{{ configKit.titleSimple }}</div>
        </div>
        <template v-for="(item, index) in storePageMenu" :key="item.name">
          <el-sub-menu
              v-if="menuItemFilter(item.children).length > 0"
              :index="item.name"
          >
            <template #title>
              <el-icon>
                <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
              </el-icon>
              <span>{{ item.menuTitle }}</span>
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
            <el-icon>
              <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
            </el-icon>
            <!--            <div class="flex justify-center items-center h-full">-->
            <!--            </div>-->
            <template #title>
              <span>{{ item.menuTitle }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="h-screen bg-gray-100">
      <div
          class="mb-1 flex w-full items-center justify-between bg-white shadow-md"
          :style="{ height: headerHeight }"
      >
        <kit-icon
            :name="isCollapse ? 'common-menu-open' : 'common-menu-close'"
            class="ml-2 h-5 w-5"
            @click="setCollapse(!isCollapse)"
        />
        <div class="mr-4 rounded-full border border-solid border-blue-600">
          <kit-icon
              name="common-avatar"
              class="h-7 w-7 text-blue-600"
              @click="usercenter = true"
          ></kit-icon>
        </div>
        <el-drawer
            v-model="usercenter"
            title="个人中心"
            size="200px"
            direction="rtl"
        >
          <user-center/>
        </el-drawer>
      </div>
      <div
          class="overflow-auto p-2"
          :style="{
          width: 'calc(100vw - ' + menuWidth + ')',
          height: 'calc(100vh - ' + headerHeight + ')',
        }"
      >
        <router-view/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, computed} from "vue"
import {storePageMenu} from "/lib/router"
import {useRouter} from "vue-router"
import {configKit, storeCurrentRoute} from "/lib/store"
import UserCenter from "./user-center.vue"

const router = useRouter()
// 顶部高
const headerHeight = ref("60px")
// menu width
const menuWidth = ref("200px")
const isCollapse = ref(false)
const usercenter = ref(false)

function routeTo(name) {
  router.push({name})
}

function menuChange() {
  const element = document.getElementById("home_page")
  setCollapse(element.offsetWidth < 1200)
}

function setCollapse(collapse) {
  isCollapse.value = collapse
  if (isCollapse.value) {
    menuWidth.value = "63px"
  } else {
    menuWidth.value = "200px"
  }
}

// menu
function menuItemFilter(itemChildren) {
  if (!itemChildren) itemChildren = []
  return itemChildren.filter((child) => !child.authFunc || child.authFunc())
}

onMounted(() => {
  menuChange()
  // window.onresize = menuChange
})
</script>
