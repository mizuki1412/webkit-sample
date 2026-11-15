<template>
    <a-layout id="home_page">
        <!-- Noir：72px 纯图标栏（设计签名，样图 design/assets/1.jpg）。
         结构：顶部汉堡方块 + 浮层圆角卡片（surface 底）+ accent 圆角方块选中态 + 底部 more。
         其余设计语言沿用 web-frame 文本侧栏（Porcelain 侧栏形态见 DESIGN.md）。 -->
        <a-layout-sider v-if="isRail" class="rail-sider">
            <div class="rail-col">
                <button class="rail-trigger" type="button" title="菜单" @click="drawerOpen = true">
                    <kit-icon class="h-4 w-4" name="menu"></kit-icon>
                </button>
                <div class="rail">
                    <template v-for="item in storePageMenu" :key="item.name">
                        <!-- 分组：点击弹出浮层面板（DESIGN.md 规则 6：展开菜单面板浮层用 surface-raised） -->
                        <div v-if="visibleChildren(item).length > 0" class="rail-slot">
                            <button class="rail-item" :class="{ 'rail-item-active': isGroupActive(item) }" type="button"
                                :title="item.menuTitle" @click="togglePanel(item)">
                                <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
                            </button>
                            <div v-if="panelName === item.name" class="rail-panel">
                                <button v-for="child in visibleChildren(item)" :key="child.name" class="rail-panel-item"
                                    :class="{ 'rail-panel-item-active': child.name === activeName }" type="button"
                                    @click="routeTo(child.name)">
                                    {{ child.menuTitle }}
                                </button>
                            </div>
                        </div>
                        <!-- 叶子：直接跳转 -->
                        <button v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
                            class="rail-item" :class="{ 'rail-item-active': item.name === activeName }" type="button"
                            :title="item.menuTitle" @click="routeTo(item.name)">
                            <kit-icon class="h-4 w-4" :name="item.menuIcon"></kit-icon>
                        </button>
                    </template>
                    <!-- 底部 more：个人中心 -->
                    <button class="rail-item rail-more" type="button" title="更多" @click="usercenter = true">
                        <kit-icon class="h-4 w-4" name="more"></kit-icon>
                    </button>
                </div>
            </div>
        </a-layout-sider>
        <a-layout-sider v-else v-model:collapsed="isCollapse" :trigger="null" collapsible>
            <div class="text-white text-center cursor-pointer h-[64px] _flex_center text-lg" @click="routeTo('index')">
                {{ isCollapse ? configKit.titleSimple : configKit.title }}
            </div>
            <div class="overflow-auto no-scrollbar" :style="{ height: 'calc(100vh - 64px)' }">
                <a-menu :collapsed="isCollapse" theme="dark" mode="inline" @click="tap" v-model:openKeys="openKeys"
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
            <!-- Noir 顶部件区：无贯通条带（noir DESIGN.md 规则 7 浮层卡片构图）——
           描边搜索卡片 / 用户件各自独立浮在画布上，不共底不共边框；日期胶囊属日期语义场景，壳层不出现 -->
            <div v-if="isRail" class="topbar-float">
                <div class="topbar-search">
                    <kit-icon class="h-4 w-4 shrink-0" name="search"></kit-icon>
                    <!-- 设计签名件（样图实测 ~395×36）；示例壳层暂无搜索能力，仅造型占位 -->
                    <input class="topbar-search-input" type="text" placeholder="搜索" aria-label="搜索" />
                </div>
                <div class="flex-1"></div>
                <button class="topbar-user" type="button" title="个人中心" @click="usercenter = true">
                    <UserOutlined />
                </button>
            </div>
            <a-layout-header v-else style="padding: 0" class="w-full flex items-center justify-between">
                <a-button type="text" size="large" @click="setCollapse(!isCollapse)">
                    <MenuUnfoldOutlined v-if="isCollapse" />
                    <MenuFoldOutlined v-else />
                </a-button>
                <a-button type="text" size="large" @click="usercenter = true" class="mr-2">
                    <UserOutlined />
                </a-button>
            </a-layout-header>
            <a-layout-content class="overflow-auto p-2"
                :style="{ height: isRail ? 'calc(100vh - 88px)' : 'calc(100vh - 64px)' }">
                <!-- Noir：88 = 顶部件区 space-8 32 + control-h 36 + space-5 20；文本侧栏分支沿用 64px header -->
                <div class="w-full min-h-full bg-white p-2 rounded-sm">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <!-- 图标栏没有文字位：汉堡方块打开完整菜单抽屉（分组标题 + 页面名） -->
    <a-drawer v-if="isRail" v-model:open="drawerOpen" :title="configKit.title" size="240" placement="left">
        <nav class="rail-drawer">
            <template v-for="item in storePageMenu" :key="item.name">
                <template v-if="visibleChildren(item).length > 0">
                    <div class="d-label">{{ item.menuTitle }}</div>
                    <button v-for="child in visibleChildren(item)" :key="child.name" class="rail-drawer-item"
                        :class="{ 'rail-drawer-item-active': child.name === activeName }" type="button"
                        @click="routeTo(child.name)">
                        {{ child.menuTitle }}
                    </button>
                </template>
                <button v-else-if="item.name && item.component && (!item.authFunc || item.authFunc())"
                    class="rail-drawer-item" :class="{ 'rail-drawer-item-active': item.name === activeName }"
                    type="button" @click="routeTo(item.name)">
                    {{ item.menuTitle }}
                </button>
            </template>
        </nav>
    </a-drawer>
    <a-drawer v-model:open="usercenter" title="个人中心" size="300" placement="right">
        <user-center />
    </a-drawer>
</template>
<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { RouteMetaKey, storePageMenu } from "/web-frame/router"
import { useRouter } from "vue-router"
import { configKit, storeCurrentRoute } from "/web-frame/store"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@antdv-next/icons';
import UserCenter from "/web-frame/components-layout/user-center.vue"
import { useDesignTheme } from "../design/use-design-theme"

const router = useRouter()
const { designId } = useDesignTheme()
const isRail = computed(() => designId.value === "noir")
const isCollapse = ref(false)
const usercenter = ref(false)
const drawerOpen = ref(false)
const selectedKeys = ref([])
const openKeys = ref([])

// 图标栏的选中跟踪：与文本菜单 selectedKeys 同语义（parentName 优先）
const activeName = computed(() => storeCurrentRoute.meta?.[RouteMetaKey.parentName] || storeCurrentRoute.name)
const panelName = ref(null)

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

function isGroupActive(item) {
    return item.name === activeName.value || visibleChildren(item).some(child => child.name === activeName.value)
}

function togglePanel(item) {
    panelName.value = panelName.value === item.name ? null : item.name
}

// 浮层面板：点击栏外任意处关闭
function onDocClick(e) {
    if (!e.target.closest('.rail-slot')) panelName.value = null
}

watch(panelName, (val) => {
    if (val) document.addEventListener('click', onDocClick)
    else document.removeEventListener('click', onDocClick)
})

onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

function routeTo(name) {
    panelName.value = null
    drawerOpen.value = false
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
/* Noir 图标栏 —— 全部取自 src/design/themes.css 语义变量（noir，过渡期冻结）。
   结构尺寸（44px 方块等）为样图实测值，token 未覆盖、design_lint 不约束 width/height。
   注意：rail-col 不可设 overflow（分组浮层面板溢出侧栏渲染）。 */
.rail-sider {
    flex: 0 0 var(--layout-sidebar) !important;
    width: var(--layout-sidebar) !important;
    min-width: var(--layout-sidebar) !important;
    max-width: var(--layout-sidebar) !important;
}

.rail-col {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    padding: var(--space-8) var(--space-2) var(--space-12);
}

/* 顶部汉堡：独立圆角方块，accent 图标（样图签名之一） */
.rail-trigger {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    color: var(--color-accent);
}

/* 图标栏卡片：与内容卡片同 surface 底、radius-lg 浮层形态（样图实测） */
.rail {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) 0;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
}

.rail-slot {
    position: relative;
}

.rail-item {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: var(--radius-lg);
    color: var(--color-sidebar-text);
}

.rail-item:hover {
    background: var(--color-surface-raised);
    color: var(--color-text);
}

.rail-item-active,
.rail-item-active:hover {
    background: var(--color-sidebar-active-bg);
    color: var(--color-sidebar-active-text);
}

.rail-more {
    margin-top: auto;
}

/* 分组浮层面板：surface-raised 底 + 描边（Noir 无阴影语言） */
.rail-panel {
    position: absolute;
    left: calc(100% + var(--space-2));
    top: 0;
    min-width: 160px;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-2);
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    z-index: 1000;
}

.rail-panel-item {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: var(--radius-sm);
    color: var(--color-sidebar-text);
    font-size: var(--font-size-base);
}

.rail-panel-item:hover {
    background: var(--color-border);
    color: var(--color-text);
}

.rail-panel-item-active,
.rail-panel-item-active:hover {
    background: var(--color-sidebar-active-bg);
    color: var(--color-sidebar-active-text);
}

/* 菜单抽屉（图标栏的文字位） */
.rail-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.rail-drawer .d-label {
    margin-top: var(--space-4);
}

.rail-drawer-item {
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-size: var(--font-size-base);
}

.rail-drawer-item:hover {
    background: var(--color-surface-raised);
}

.rail-drawer-item-active,
.rail-drawer-item-active:hover {
    background: var(--color-sidebar-active-bg);
    color: var(--color-sidebar-active-text);
}

/* 顶部件区（无贯通条带，noir DESIGN.md 规则 7）：各件独立浮在画布上。
   区高 = space-8 32 + control-h 36 + space-5 20 = 88，与内容区 calc 同步；
   顶部件与图标栏列的分离由两侧 padding 提供（sider 72 + content-x 24 ≥ space-5）。 */
.topbar-float {
    display: flex;
    align-items: center;
    gap: var(--space-6);
    padding: var(--space-8) var(--layout-content-x) var(--space-5);
}

/* 描边输入式搜索卡片：非胶囊，底近画布（样图实测搜索框底与 bg 同档，仅描边分层） */
.topbar-search {
    width: min(24rem, 42%);
    height: var(--layout-control-h);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0 var(--space-3);
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
}

.topbar-search:focus-within {
    border-color: var(--color-border-strong);
    color: var(--color-text);
}

.topbar-search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text);
    font-size: var(--font-size-base);
}

.topbar-search-input::placeholder {
    color: var(--color-text-faint);
}

/* 用户件：独立浮层卡片，与 rail 汉堡方块同形态（surface 底、radius-lg、无边框） */
.topbar-user {
    width: var(--layout-control-h);
    height: var(--layout-control-h);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    color: var(--color-sidebar-text);
}

.topbar-user:hover {
    background: var(--color-surface-raised);
    color: var(--color-text);
}

.rail-trigger:focus-visible,
.rail-item:focus-visible,
.rail-panel-item:focus-visible,
.rail-drawer-item:focus-visible,
.topbar-user:focus-visible {
    outline: 2px solid var(--color-sidebar-active-bg);
    outline-offset: -2px;
}
</style>
