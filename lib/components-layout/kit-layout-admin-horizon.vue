<template>
  <div class="w-screen h-screen">
    <div class="w-full shadow-md flex justify-between items-center mb-1" :style="{height: headerHeight,backgroundColor:'#23479C', color:'white'}">
      <div class="flex justify-center items-center cursor-pointer w-1/4" @click="routeTo('index')">
        <div class="text-center">{{configKit.TITLE}}</div>
      </div>
      <el-menu
          :class="menuWith===''?'grow':''"
          :style="menuWith===''?{}:{width: menuWith}"
          activeTextColor="#00d0FF"
          textColor="white"
          :unique-opened="true"
          :collapse-transition="false"
          backgroundColor="#23479C"
          mode="horizontal"
          :default-active="storeCurrentRoute.name"
          @select="routeTo">
        <template v-for="(item, index) of storePageMenu" :key="item.name">
          <el-sub-menu
              v-if="menuItemFilter(item.children).length>0"
              :index="item.name">
            <template #title>
              <div class="flex items-center">
                <kit-icon class="w-4 h-4" :name="item.menuIcon"></kit-icon>
                <span class="ml-2">{{item.menuTitle }}</span>
              </div>
            </template>
            <el-menu-item
                v-for="child of menuItemFilter(item.children)"
                :index="child.name">
              <template #title>
                {{child.menuTitle}}
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item
              v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
              :index="item.name">
            <div class="flex justify-center items-center h-full">
              <kit-icon class="w-4 h-4" :name="item.menuIcon"></kit-icon>
            </div>
            <template #title>
              <span class="ml-2">{{ item.menuTitle }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="rounded-full border border-white border-solid mx-4">
        <kit-icon name="common-avatar" class="w-7 h-7 text-white" @click="usercenter=true"></kit-icon>
      </div>
      <el-drawer
          v-model="usercenter"
          title="个人中心"
          size="200px"
          direction="rtl">
        <user-center class="text-black" />
      </el-drawer>
    </div>
    <div class="overflow-auto p-4 w-full bg-gray-100" :style="{height: 'calc(100vh - '+headerHeight+')'}">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,computed } from 'vue';
import {storePageMenu} from "/lib/router";
import {useRouter} from "vue-router";
import {configKit, storeCurrentRoute} from "/lib/store";
import UserCenter from "./user-center.vue";

defineProps({
  menuWith:{
    type: String,
    default: ""
  }
})

const router = useRouter()
// 顶部高
const headerHeight = ref('60px')
const usercenter = ref(false)

function routeTo(name){
  router.push({name})
}

// menu
function menuItemFilter(itemChildren) {
  if(!itemChildren) itemChildren = []
  return itemChildren.filter((child) => !child.authFunc || child.authFunc());
}

onMounted(()=>{

})

</script>
<style>
.el-menu--horizontal{
  border-bottom-width: 0;
}
</style>
