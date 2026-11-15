<template>
    <a-layout id="home_page">
        <!-- Lumen 侧栏（1.jpg 形式，DESIGN.md 侧栏语法）：列透明，白色圆角菜单条浮于窗口底；
             菜单条/选中态/左缘胶囊标样式由 src/design/adapter.css 驱动。宽度对应 --layout-sidebar=200px。 -->
        <a-layout-sider v-model:collapsed="isCollapse" :trigger="null" collapsible :width="200">
            <div class="sider-brand" @click="routeTo('index')">
                {{ isCollapse ? configKit.titleSimple : configKit.title }}
            </div>
            <div class="sider-menu-scroll overflow-auto no-scrollbar" :style="{ height: 'calc(100vh - 64px)' }">
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
            <!-- 无贯通顶栏（语言规则）：折叠钮/用户钮浮于窗口底 -->
            <a-layout-header style="padding: 0" class="w-full flex items-center justify-between">
                <a-button type="text" size="large" @click="setCollapse(!isCollapse)">
                    <MenuUnfoldOutlined v-if="isCollapse" />
                    <MenuFoldOutlined v-else />
                </a-button>
                <a-button type="text" size="large" @click="usercenter = true" class="mr-2">
                    <UserOutlined />
                </a-button>
            </a-layout-header>
            <a-layout-content class="overflow-auto" :style="{ height: 'calc(100vh - 64px)' }">
                <!-- 内容白卡浮于窗口底（卡片化由 adapter.css 驱动） -->
                <div class="w-full min-h-full">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
    <a-drawer v-model:open="usercenter" title="个人中心" size="300" placement="right">
        <user-center />
    </a-drawer>
</template>
<script setup>
import { ref, watch } from "vue"
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
/* 品牌卡：白底轻投影、无边框（1.jpg hamburger 同法，DESIGN.md 侧栏语法） */
.sider-brand {
    height: 40px;
    margin: var(--space-3);
    padding: 0 var(--space-2);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    color: var(--color-text);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
}
</style>
