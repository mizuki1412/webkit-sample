import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {updateStoreCurrentRoute, submitErrChanel, storeUserInfo, updateStoreUserInfo} from "../store";
import {RouteMetaKey, RouteName, storePageMenu} from "./menu";
import {UserInfo} from "../dao/user";

// route定义见menu.js
export function checkAuth(route) {
  if (route && route[RouteMetaKey.authFunc]) {
    return route[RouteMetaKey.authFunc]();
  }
  return true
}

// 寻找本用户对应权限的第一个route
export function getMainRoute() {
  for (const menu of storePageMenu) {
    if (!menu) { continue; }
    if (menu.children && menu.children.length>0) {
      if (!menu) { continue; }
      for (const m of menu.children) {
        if (checkAuth(m)) { return m.name ? {name: m.name} : null; }
      }
    } else if (checkAuth(menu)) { return menu.name ? {name: menu.name} : null; }
  }
}

// 基础的路由前拦截
export async function routeBaseBefore(to, from, next){
  if (to.name !== from.name) {
    NProgress.start();
  }
  if(to.name===RouteName.login){
    next()
    return
  }
  if(to.meta[RouteMetaKey.authDisable]){
    if(to.name===RouteName.index && !to.redirect){
      next(getMainRoute())
    }else{
      next()
    }
    return
  }
  await RouteInterceptorConfig.checkUserLogin()
  // 初始化err-msg-channel
  submitErrChanel('');
  // 如果是menu的主页，同时redirect不存在，则跳转至第一个
  if(to.name===RouteName.index && !to.redirect){
    next(getMainRoute())
  }
  else{
    // 处理需要登录的
    if (!storeUserInfo.user) {
      storeUserInfo.redirect = to
      next({name: RouteName.login});
    } else {
      // 用户权限
      if (checkAuth(to)) {
        next();
      } else {
        if (from.name === '404') {
          next({name: RouteName.index});
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

// 用于router interceptor的自定义代码块
export const RouteInterceptorConfig = {
  // 校验用户登录
  checkUserLogin: async function (){
    if (!storeUserInfo.user) {
      // 校验登录用户
      let data = await UserInfo()
      if(data.data){
        updateStoreUserInfo(data.data)
      }
    }
  }
}
