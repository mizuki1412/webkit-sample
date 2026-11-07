/**
 * webkit 通用前端框架层 —— 标准装配入口。
 *
 * 分层（详见 web-frame/AGENTS.md）：
 *   - 顶层目录（request/store/router/service/components/components-layout/utils/plugin）
 *     为后端中立的核心层，禁止 import web-frame/backend/*；
 *   - web-frame/backend/<name>/ 为后端适配器层（go-frame 是第一个适配器），允许 import 核心层。
 *
 * 新项目 main.js 一行接入：
 *   import {setupWebkit} from "/web-frame"
 *   import {goFrameBackend} from "/web-frame/backend/go-frame"
 *   setupWebkit(app, {env: import.meta.env, backend: goFrameBackend, routes})
 */
import "antdv-next/dist/reset.css"
// 同时用于tailwind的初始css
import "./tailwind.css"

import {Modal} from "antdv-next"
import KitIcon from "./components/kit-icon"
import KitModal, {modalFrostedMask} from "./components/kit-modal"
import KitPaginationPage from "./components/kit-pagination-page"
import {setAxiosDefaultBaseUrl} from "./request"
import {useRouter} from "./router"
import {routeBaseAfter, routeBaseBefore} from "./router/intercepter"
import {configKitInit} from "./store"

// 让命令式 Modal.confirm/info/... 拥有与 kit-modal 一致的毛玻璃遮罩
;['confirm', 'info', 'success', 'warning', 'error'].forEach((method) => {
  const origin = Modal[method].bind(Modal)
  Modal[method] = (config = {}) =>
    origin({styles: {mask: modalFrostedMask, ...config.styles}, ...config})
})

// 默认全局注册的轻量组件。
// 重库组件（KitRichText/tinymce、KitGantt/dhtmlx、v-chart/echarts、form-create）
// 不在此注册——全局注册会把它们拉进首屏主包；在使用页面按需 import 即可
// （antdv 组件由 unplugin-vue-components 自动按需引入，无需 app.use）。
const defaultComponents = [KitModal, KitIcon, KitPaginationPage]

/**
 * webkit 标准装配：环境配置 → 后端适配器安装 → 组件注册 → 路由与全局守卫。
 * @param app Vue app 实例
 * @param opts env        环境变量，默认 import.meta.env
 *             backend    后端适配器（契约见web-frame/AGENTS.md；go-frame 用 goFrameBackend）
 *             routes     路由表；传入则创建 router、构建菜单并挂全局守卫
 *             components 全局注册的组件插件，默认 defaultComponents，传 [] 可全手动
 * @returns router（opts.routes 传入时）
 */
export function setupWebkit(app, opts = {}) {
  const {env = import.meta.env, backend, routes, components = defaultComponents} = opts
  configKitInit(env)
  // request 与 store 单向依赖：baseUrl 在此装配点接线（configkit 不再反向 import request）
  setAxiosDefaultBaseUrl()
  if (backend) {
    backend.install?.({app})
  }
  for (const c of components) {
    app.use(c)
  }
  if (routes) {
    const router = useRouter(app, routes)
    router.beforeEach(routeBaseBefore)
    router.afterEach(routeBaseAfter)
    return router
  }
}
