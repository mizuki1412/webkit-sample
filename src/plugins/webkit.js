
import {configKitInit} from "/lib/store";
import {VueEcharts} from "/lib/plugin";
import {KitEmpty, KitIcon, KitModal, KitTable} from "/lib/components";
import {useRouter as _useRouter} from "/lib/router";
import {routes} from "../router";
import {routeBaseAfter, routeBaseBefore} from "/lib/router/intercepter";

export function useWebkit(app){
  configKitInit(import.meta.env)
  // 全局注册lib组件
  app.use(VueEcharts)
  app.use(KitEmpty)
  app.use(KitModal)
  app.use(KitTable)
  app.use(KitIcon)

  // router
  const router = _useRouter(app, routes)
  router.beforeEach(routeBaseBefore)
  router.afterEach(routeBaseAfter)
}
