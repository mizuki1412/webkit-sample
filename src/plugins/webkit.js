// icon雪碧图
import 'virtual:svg-icons-register';
import {configKitInit} from "webkit1412/lib/store";
import {VueEcharts} from "webkit1412/lib/plugin";
import {KitEmpty, KitIcon, KitModal, KitTable} from "webkit1412/lib/components";
import {useRouter as _useRouter} from "webkit1412/lib/router";
import {routes} from "../router";
import {routeBaseAfter, routeBaseBefore} from "webkit1412/lib/router/intercepter";

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
  router.beforeEach((to,from,next)=>{
    routeBaseBefore(to,from,next)
  })
  router.afterEach((to)=>{
    routeBaseAfter(to)
  })
}
