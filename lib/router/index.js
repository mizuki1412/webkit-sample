import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router"
import { buildMenu } from "./menu"
import { configKit } from "../store"

// env: VITE_ROUTE_MODE,BASE_URL
export function useRouter(app, routes) {
  let mode
  if (
    configKit.routeMode === "history" ||
    configKit.routeMode === "" ||
    !configKit.routeMode
  ) {
    mode = createWebHistory(configKit.routeBaseUrl)
  } else {
    mode = createWebHashHistory(configKit.routeBaseUrl)
  }
  const router = createRouter({
    history: mode,
    routes,
    // 跳转时 回到顶部
    // scrollBehavior() {
    //   // savedPosition
    //   return {
    //     x: 0,
    //     y: 0,
    //   };
    // },
  })
  app.use(router)
  // 构建菜单数据
  buildMenu(routes)
  return router
}

export * from "./menu"
