import NProgress from "nprogress"
import "nprogress/nprogress.css"
import {
  updateStoreCurrentRoute,
  submitErrChanel,
  storeUserInfo,
  updateStoreUserInfo,
} from "../store"
import {RouteMetaKey, RouteName, storeAppMenu, storePageMenu} from "./menu"
import {UserInfo} from "../dao/user"

// route定义见menu.js
export function checkAuth(route) {
  if (route && route[RouteMetaKey.authFunc]) {
    return route[RouteMetaKey.authFunc]()
  }
  return true
}

// 寻找本用户对应权限的第一个route; storePageMenu/storeAppMenu
export function getMainRoute(store) {
  for (const menu of store) {
    if (!menu) {
      continue
    }
    if (menu.children && menu.children.length > 0) {
      if (!menu) {
        continue
      }
      for (const m of menu.children) {
        if (checkAuth(m)) {
          return m.name ? {name: m.name} : null
        }
      }
    } else if (checkAuth(menu)) {
      return menu.name ? {name: menu.name} : null
    }
  }
}

// 正常逻辑下的next
function _next(to, next) {
  if (to.name === RouteName.index || to.name === RouteName.indexApp) {
    if (to.name === RouteName.index) next(getMainRoute(storePageMenu))
    else next(getMainRoute(storeAppMenu))
  } else {
    next()
  }
}

// 基础的路由前拦截
export async function routeBaseBefore(to, from, next) {
  if (to.name !== from.name) {
    NProgress.start()
  }
  // 区分路由的所属，按前缀，如app:，web-admin无前缀
  if (to.name === RouteName.login || to.name === RouteName.loginApp) {
    next()
    return
  }
  // 无需登录
  if (to.meta[RouteMetaKey.authDisable]) {
    _next(to, next)
    return
  }
  // 需要登录，先检查登录信息
  await RouteInterceptorConfig.checkUserLogin()
  submitErrChanel("")
  if (!storeUserInfo.user) {
    storeUserInfo.redirect = to
    if (to.name.indexOf("app:") === 0) {
      next({name: RouteName.loginApp})
    } else {
      next({name: RouteName.login})
    }
  } else {
    // 用户权限
    if (checkAuth(to)) {
      _next(to, next)
    } else {
      // todo
      next({name: "404", params: {msg: "当前页面无权限查看"}})
    }
  }
}

// 基础的路由后拦截
export function routeBaseAfter(to) {
  const lastMatch = to.matched[to.matched.length - 1]
  if (lastMatch) {
    // 先保存当前路由至store
    updateStoreCurrentRoute(to)
    // 路由完即结束
    NProgress.done()
  }
}

// 用于router interceptor的自定义代码块
export const RouteInterceptorConfig = {
  // 校验用户登录
  checkUserLogin: async function () {
    if (!storeUserInfo.user) {
      // 校验登录用户
      let data = await UserInfo(false)
      if (data.data) {
        updateStoreUserInfo(data.data)
      }
    }
  },
}
