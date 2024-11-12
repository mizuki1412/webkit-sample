import {configKitInit} from "/lib/store"
import VueEcharts from "/lib/plugin/echarts"
import {useRouter as _useRouter} from "/lib/router"
import {routes} from "../router"
import {routeBaseAfter, routeBaseBefore} from "/lib/router/intercepter"

// 同时用于tailwind的初始css
import 'ant-design-vue/dist/reset.css'
// 引入tailwind
import "/lib/tailwind.css"
// 引入其他框架的css，如果自动引入可能被tailwind覆盖。
import "vant/lib/index.css"

import KitModal from "../../lib/components/kit-modal"
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
  // app.use(KitFabricShow)
  app.use(KitGantt)

  // element 全局导入icon
  // for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  //   app.component(key, component)
  // }

  // router
  const router = _useRouter(app, routes)
  router.beforeEach(routeBaseBefore)
  router.afterEach(routeBaseAfter)
}
