import {configKitInit} from "/lib/store"
import VueEcharts from "/lib/plugin/echarts"
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
import KitRichText from "../../lib/components/kit-rich-text"
import KitUpload from "../../lib/components/kit-upload"
import KitGantt from "../../lib/components/kit-gantt"
// tailwind中覆盖用的css
import "../after.css"

export function useWebkit(app) {
  configKitInit(import.meta.env)
  // 全局注册lib组件
  app.use(VueEcharts)
  app.use(KitModal)
  app.use(KitIcon)
  app.use(KitPaginationPage)
  app.use(KitRichText)
  app.use(KitUpload)
  app.use(KitGantt)

  const router = _useRouter(app, routes)
  router.beforeEach(routeBaseBefore)
  router.afterEach(routeBaseAfter)
}
