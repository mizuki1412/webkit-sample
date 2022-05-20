import {configKitInit} from "/lib/store"
import VueEcharts from "/lib/plugin/echarts"
import {useRouter as _useRouter} from "/lib/router"
import {routes} from "../router"
import {routeBaseAfter, routeBaseBefore} from "/lib/router/intercepter"

// todo 考虑到tailwind会覆盖其他element ui
import "element-plus/theme-chalk/index.css"
import "vant/lib/index.css"
import KitEmpty from "../../lib/components/kit-empty"
import KitModal from "../../lib/components/kit-modal"
import KitTable from "../../lib/components/kit-table"
import KitIcon from "../../lib/components/kit-icon"
import KitPaginationPage from "../../lib/components/kit-pagination-page"
import KitRichText from "../../lib/components/kit-rich-text"
import KitUpload from "../../lib/components/kit-upload"
import KitFabricShow from "../../lib/components/kit-fabric-show"
import "../after.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function useWebkit(app) {
  configKitInit(import.meta.env)
  // 全局注册lib组件
  app.use(VueEcharts)
  app.use(KitEmpty)
  app.use(KitModal)
  app.use(KitTable)
  app.use(KitIcon)
  app.use(KitPaginationPage)
  app.use(KitRichText)
  app.use(KitUpload)
  app.use(KitFabricShow)

  // element 全局导入icon
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // router
  const router = _useRouter(app, routes)
  router.beforeEach(routeBaseBefore)
  router.afterEach(routeBaseAfter)
}
