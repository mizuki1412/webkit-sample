<template>
    <a-layout id="home_page">
        <!-- 侧栏：品牌卡（标题 + 折叠钮）+ 默认 a-menu，宽 200px -->
        <a-layout-sider v-model:collapsed="isCollapse" :trigger="null" collapsible :width="200">
            <!-- 品牌卡：标题 + 折叠钮同方块（折叠钮即 1.jpg hamburger 位） -->
            <div class="sider-brand" :class="{ 'is-collapsed': isCollapse }">
                <span v-if="!isCollapse" class="sider-brand-title" @click="routeTo('index')">
                    {{ configKit.title }}
                </span>
                <button class="sider-collapse" type="button" :title="isCollapse ? '展开菜单' : '收起菜单'"
                    @click="setCollapse(!isCollapse)">
                    <MenuUnfoldOutlined v-if="isCollapse" />
                    <MenuFoldOutlined v-else />
                </button>
            </div>
            <div class="sider-menu-scroll overflow-auto no-scrollbar"
                :style="{ height: 'calc(100vh - 64px)', padding: '0 12px' }">
                <a-menu :collapsed="isCollapse" mode="inline" @click="tap" v-model:openKeys="openKeys"
                    v-model:selectedKeys="selectedKeys">
                    <template v-for="(item, index) in storePageMenu" :key="index">
                        <a-sub-menu v-if="visibleChildren(item).length > 0" :key="item.name" :title="item.menuTitle">
                            <template #icon>
                                <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
                            </template>
                            <a-menu-item v-for="child in visibleChildren(item)" :key="child.name"
                                :title="child.menuTitle">
                                <span>{{ child.menuTitle }}</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <a-menu-item v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
                            :key="item.name" :title="item.menuTitle">
                            <template #icon>
                                <kit-icon class="w-4 h-4" :name="item.menuIcon"></kit-icon>
                            </template>
                            <span>{{ item.menuTitle }}</span>
                        </a-menu-item>
                    </template>
                </a-menu>
            </div>
        </a-layout-sider>
        <a-layout>
            <!-- 无贯通顶栏：标签行白卡背景；个人中心独立圆形浮钮 -->
            <a-layout-header style="padding: 0" class="topbar w-full flex items-center">
                <nav class="topbar-tabs">
                    <button v-for="t in pageTabs" :key="t.name" type="button" class="topbar-tab"
                        :class="{ 'topbar-tab-active': t.name === currentName }" @click="routeTo(t.name)">
                        {{ t.title }}
                        <span v-if="pageTabs.length > 1" class="topbar-tab-close" title="关闭标签"
                            @click.stop="closeTab(t.name)">×</span>
                    </button>
                </nav>
                <button class="topbar-user" type="button" title="个人中心" @click="usercenter = true">
                    <UserOutlined />
                </button>
            </a-layout-header>
            <a-layout-content class="overflow-auto" :style="{ height: 'calc(100vh - 64px)' }">
                <!-- 标签页保活：keep-alive 缓存所有已入签页面（切换标签不重建、状态保留），
                     关闭标签时组件名移出 include，缓存即被丢弃。
                     注意：页面组件名必须等于路由名（文件名推断不一致的用 defineOptions 声明）。 -->
                <div class="w-full min-h-full">
                    <router-view v-slot="{ Component }">
                        <keep-alive :include="keepNames">
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <a-drawer v-model:open="usercenter" title="个人中心" size="300" placement="right">
        <user-center />
    </a-drawer>
</template>
<script setup>
import { computed, ref, watch } from "vue"
import { RouteMetaKey, storePageMenu } from "/web-frame/router"
import { useRouter } from "vue-router"
import { configKit, storeCurrentRoute } from "/web-frame/store"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@antdv-next/icons';
import UserCenter from "/web-frame/components-layout/user-center.vue"

const router = useRouter()
const isCollapse = ref(false)
const usercenter = ref(false)
const selectedKeys = ref([])
const openKeys = ref([])

const currentName = computed(() => storeCurrentRoute.name)

// 顶栏标签行：打开过的页面自动入签，点击切回，可关闭
const pageTabs = ref([])
// 标签页 keep-alive 白名单：组件名（=路由名）列表；入签即缓存，关签即销毁
const keepNames = computed(() => pageTabs.value.map(t => t.name))
watch(currentName, (name) => {
    const title = storeCurrentRoute.meta?.menuTitle
    if (!title) return
    if (!pageTabs.value.some(t => t.name === name)) {
        pageTabs.value.push({ name, title })
    }
}, { immediate: true })

function closeTab(name) {
    const idx = pageTabs.value.findIndex(t => t.name === name)
    if (idx < 0) return
    const wasActive = name === currentName.value
    pageTabs.value.splice(idx, 1)
    if (wasActive && pageTabs.value.length > 0) {
        routeTo(pageTabs.value[Math.min(idx, pageTabs.value.length - 1)].name)
    }
}

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
    router.push({ name })
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
<style scoped>
/* 品牌卡：标题 + 折叠钮同方块，白底轻投影、无边框 */
.sider-brand {
    box-sizing: border-box;
    height: 40px;
    margin: 12px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(21, 25, 51, 0.06);
}

.sider-brand.is-collapsed {
    justify-content: center;
}

.sider-brand-title {
    flex: 1;
    min-width: 0;
    text-align: center;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.sider-collapse {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.65);
}

.sider-collapse:hover {
    background: #f5f5f5;
    color: rgba(0, 0, 0, 0.88);
}

/* 顶栏：三块（品牌卡/标签卡/个人中心）同高 40px、统一沟槽 */
.topbar-tabs {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(21, 25, 51, 0.06);
    overflow-x: auto;
    overflow-y: hidden;
}

.topbar-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 12px;
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 12px;
    white-space: nowrap;
}

.topbar-tab:hover {
    background: #f5f5f5;
    color: rgba(0, 0, 0, 0.88);
}

.topbar-tab-active,
.topbar-tab-active:hover {
    background: rgba(22, 119, 255, 0.1);
    color: #1677ff;
    font-weight: 500;
}

.topbar-tab-close {
    font-size: 12px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.45);
}

.topbar-tab-close:hover {
    color: #ff4d4f;
}

.topbar-user {
    box-sizing: border-box;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: #fff;
    border-radius: 999px;
    box-shadow: 0 1px 3px 0 rgba(21, 25, 51, 0.06);
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
}

.topbar-user:hover {
    color: #1677ff;
}
</style>
