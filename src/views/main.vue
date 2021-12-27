<template>
  <div class="w-screen h-screen flex" id="home_page">
    <div :style="{width: menuWidth}">
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
          @select="routeTo">
        <div class="flex justify-center items-center cursor-pointer text-white" @click="routeTo('index')" :style="{height: headerHeight}">
          <div v-if="!isCollapse">Demo System</div>
          <div v-else>Demo</div>
        </div>
        <template v-for="(item, index) of storePageMenu" :key="index">
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
              v-else-if="item.name && (!item.authFunc || item.authFunc())"
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
    </div>
    <div class="h-screen">
      <div class="w-full shadow-md flex justify-between items-center bg-white mb-1" :style="{height: headerHeight}">
        <kit-icon :name="isCollapse?'menu-open':'menu-close'" class="w-6 h-6 ml-2" @click="setCollapse(!isCollapse)"/>
      </div>
      <router-view class="overflow-auto bg-gray-50 p-2" :style="{width: 'calc(100vw - '+menuWidth+')',height: 'calc(100vh - '+headerHeight+')'}"/>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted,computed } from 'vue';
import {storePageMenu} from "/lib/router";
import {useRouter} from "vue-router";
import {storeCurrentRoute} from "/lib/store";
const router = useRouter()

// 顶部高
const headerHeight = ref('60px')
// menu width
const menuWidth = ref('200px')
const isCollapse = ref(false)

function routeTo(name){
  router.push({name})
}

function menuChange(){
  const element = document.getElementById('home_page')
  setCollapse(element.offsetWidth < 1200)
}
function setCollapse(collapse){
  isCollapse.value = collapse
  if (isCollapse.value){
    menuWidth.value = '63px'
  }else{
    menuWidth.value = '200px'
  }
}

// menu
function menuItemFilter(itemChildren) {
  if(!itemChildren) itemChildren = []
  return itemChildren.filter((child) => !child.authFunc || child.authFunc());
}

onMounted(()=>{
  menuChange()
  // window.onresize = menuChange
})

</script>
