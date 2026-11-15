<template>
    <a-layout id="home_page">
        <!-- Lumen 侧栏（1.jpg 形式，DESIGN.md 侧栏语法）：列透明，白色圆角菜单条浮于窗口底；
             菜单条/选中态/左缘胶囊标样式由 src/design/adapter.css 驱动。宽度对应 --layout-sidebar=200px。 -->
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
                :style="{ height: 'calc(100vh - 64px)', padding: '0 var(--space-3)' }">
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
            <!-- 无贯通顶栏（语言规则）：标签行与品牌卡同款白卡背景；个人中心独立圆形浮钮 -->
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
                <!-- 内容白卡浮于窗口底（卡片化由 adapter.css 驱动）。
                     标签页保活：keep-alive 缓存所有已入签页面（切换标签不重建、状态保留），
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
/* 品牌卡：标题 + 折叠钮同方块，白底轻投影、无边框（DESIGN.md 侧栏语法） */
.sider-brand {
    box-sizing: border-box;
    height: var(--layout-control-h);
    margin: var(--space-3);
    padding: var(--space-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
}

.sider-brand.is-collapsed {
    justify-content: center;
}

.sider-brand-title {
    flex: 1;
    min-width: 0;
    text-align: center;
    color: var(--color-text);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
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
    border-radius: var(--radius-sm);
    color: var(--color-sidebar-text);
}

.sider-collapse:hover {
    background: var(--color-surface-raised);
    color: var(--color-text);
}

/* 顶栏：三块（品牌卡/标签卡/个人中心）同高 control-h、12px 沟槽、同一垂直中心带
   （盒子几何由 adapter.css 驱动：高度 64px 钉死 + 居中 + 统一 gap） */
.topbar-tabs {
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    height: var(--layout-control-h);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: 0 var(--space-1);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    overflow-x: auto;
    overflow-y: hidden;
}

.topbar-tab {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    height: 28px;
    padding: 0 var(--space-3);
    border: none;
    cursor: pointer;
    background: transparent;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    white-space: nowrap;
}

.topbar-tab:hover {
    background: var(--color-surface-raised);
    color: var(--color-text);
}

.topbar-tab-active,
.topbar-tab-active:hover {
    background: var(--color-accent-weak);
    color: var(--color-accent);
    font-weight: var(--font-weight-medium);
}

.topbar-tab-close {
    font-size: var(--font-size-sm);
    line-height: 1;
    color: var(--color-text-faint);
}

.topbar-tab-close:hover {
    color: var(--color-negative);
}

.topbar-user {
    box-sizing: border-box;
    flex-shrink: 0;
    width: var(--layout-control-h);
    height: var(--layout-control-h);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    background: var(--color-surface);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-card);
    color: var(--color-sidebar-text);
    font-size: var(--font-size-base);
}

.topbar-user:hover {
    color: var(--color-accent);
}
</style>
