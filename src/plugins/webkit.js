import {configKitInit} from "/lib/store"
import {useRouter as _useRouter} from "/lib/router"
import {routes} from "../router"
import {routeBaseAfter, routeBaseBefore} from "/lib/router/intercepter"

// 同时用于tailwind的初始css
import 'antdv-next/dist/reset.css'
// 引入tailwind
import "/lib/tailwind.css"
// 引入其他框架的css，如果自动引入可能被tailwind覆盖。
import "vant/lib/index.css"

import KitModal, { modalFrostedMask } from "../../lib/components/kit-modal"
import { Modal } from "antdv-next"

// 让命令式 Modal.confirm/info/... 拥有与 kit-modal 一致的毛玻璃遮罩
;['confirm', 'info', 'success', 'warning', 'error'].forEach((method) => {
  const origin = Modal[method].bind(Modal)
  Modal[method] = (config = {}) =>
    origin({ styles: { mask: modalFrostedMask, ...config.styles }, ...config })
})
import KitIcon from "../../lib/components/kit-icon"
import KitPaginationPage from "../../lib/components/kit-pagination-page"
// tailwind中覆盖用的css
import "../after.css"

export function useWebkit(app) {
  configKitInit(import.meta.env)
  // 全局注册轻量 lib 组件。
  // 重库组件（KitRichText/tinymce、KitGantt/dhtmlx、v-chart/echarts、form-create）
  // 不在此注册——全局注册会把它们拉进首屏主包；在使用页面按需 import 即可
  // （antdv 组件由 unplugin-vue-components 自动按需引入，无需 app.use）。
  app.use(KitModal)
  app.use(KitIcon)
  app.use(KitPaginationPage)

  const router = _useRouter(app, routes)
  router.beforeEach(routeBaseBefore)
  router.afterEach(routeBaseAfter)
}
