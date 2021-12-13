import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {updateStoreCurrentRoute,submitErrChanel, storeUserInfo} from "../store";
import {RouteMetaKey, storePageMenu} from "./menu";

export function checkAuth(route) {
  if (route.meta[RouteMetaKey.authFunc]) {
    return route.meta[RouteMetaKey.authFunc]();
  }
  return true
}

// 寻找本用户对应权限的第一个route
export function getMainRoute() {
  if (!storeUserInfo.user) { return null; }
  for (const menu of storePageMenu) {
    if (!menu) { continue; }
    if (menu.children) {
      if (!menu) { continue; }
      for (const m of menu.children) {
        if (checkAuth(m)) { return m.name ? {name: m.name} : null; }
      }
    } else if (checkAuth(menu)) { return menu.name ? {name: menu.name} : null; }
  }
}

// 基础的路由前拦截
export function routeBaseBefore(to, from, next){
  if (to.name !== from.name) {
    NProgress.start();
  }
  // 初始化err-msg-channel
  submitErrChanel('');
  // 指定默认第一个路由，如果第一个路由无权限 todo
  if (to.meta.authFunc && !to.meta.authFunc()) {
    const menu = getMainRoute();
    if (menu) { next(menu); }
    return;
  }
  if(to.meta[RouteMetaKey.authDisable]){
    next()
  }else{
    // 处理需要登录的
    if (!storeUserInfo.token) {
      storeUserInfo.redirect = to
      next({name: 'login'});
    } else {
      // 用户权限
      if (checkAuth(to)) {
        next();
      } else {
        if (from.name === '404') {
          next({name: 'index'});
        } else {
          next({name: '404', params: {msg: '当前页面无权限查看'}});
        }
      }
    }
  }

}

// 基础的路由后拦截
export function routeBaseAfter(to){
  const lastMatch = to.matched[to.matched.length - 1];
  if (lastMatch) {
    // 先保存当前路由至store
    updateStoreCurrentRoute(to);
    // 路由完即结束
    NProgress.done();
  }
}
