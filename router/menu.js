import {reactive} from "vue"

// item定义：
//   name?: string;
//   path?: string;
//   children?: IMenuItem[];
///  meta定义下:
//    icon?: string;
//    authFunc?: Function;
//    menuTitle?: string;
export const storePageMenu = reactive([])
export const storeAppMenu = reactive([])

// route meta中的定义字段
export const RouteMetaKey = {
  menuIcon: "menuIcon", // 图标信息
  authFunc: "authFunc", // 访问权限，return bool
  authDisable: "authDisable", // 禁用登录拦截
  menuTitle: "menuTitle",
  menuBelong: "menuBelong", // 值为父menu的名称，将以此作为字段划分到group
  menuEx: "menuEx", // bool, 不纳入menu
  menuTreeIndex: "menu", // bool, 表示此主路由将用于menu数据
  menuAppTreeIndex: "menuApp", // bool, 表示此主路由将用于app-menu数据
  menuAppIndex: "menuAppIndex", // bool, 表示app-menu的主菜单之一
  parentName: "parentName", // 用于子页面，所属的菜单中的父页面（主要用于menu active显示），同时也将同步置menuEx为false
}
// route 中name
export const RouteName = {
  login: "login", // 作为menu的登录页面
  loginApp: "app:login", // 作为app-menu的登录页面
  registerApp: "app:register", // 作为app-menu的注册页面
  index: "index", // 作为menu的主入口
  indexApp: "app:index", // 作为app-menu的主入口
  subApp: "app:sub", // 作为app-menu-sub子页面入口
}

// 根据路由生成 web admin menu 数据
export function buildMenu(routes) {
  _buildWebMenu(routes)
  _buildAppMenu(routes)
}

function _buildWebMenu(routes) {
  // 筛选menu所在的主路由
  let rs = routes.filter((r) => r.meta && r.meta[RouteMetaKey.menuTreeIndex])
  if (rs.length === 0) return
  let mainRoute = rs[0]
  // 取主路由的children作为menu的数据源
  let children = mainRoute.children
  if (!children || children.length === 0) return
  // 临时存放主menu
  let pool = {}
  // todo 目前只支持二级目录
  for (let item of children) {
    if (!item.meta) item.meta = {}
    if (item.meta[RouteMetaKey.menuEx] || item.meta[RouteMetaKey.parentName]) continue
    if (!item.meta[RouteMetaKey.menuBelong]) {
      let newItem = _genNewItem(item)
      pool[newItem.name] = newItem
      storePageMenu.push(newItem)
    } else {
      // 子级
      if (pool[item.meta[RouteMetaKey.menuBelong]]) {
        let newItem = _genNewItem(item)
        pool[item.meta[RouteMetaKey.menuBelong]].children.push(newItem)
      }
    }
  }
}

function _buildAppMenu(routes) {
  // 筛选menu所在的主路由
  let rs = routes.filter((r) => r.meta && r.meta[RouteMetaKey.menuAppTreeIndex])
  if (rs.length === 0) return
  let mainRoute = rs[0]
  let children = mainRoute.children
  if (!children || children.length === 0) return
  // 只支持一级菜单
  for (let item of children) {
    if (!item.meta) item.meta = {}
    if (item.meta[RouteMetaKey.menuAppIndex]) {
      let newItem = _genNewItem(item)
      storeAppMenu.push(newItem)
    }
  }
}

function _genNewItem(item) {
  return {
    name: item.name,
    path: item.path,
    component: item.component,
    // 表示此item为分组，children为分组内的menu子项
    children: [],
    menuIcon: item.meta[RouteMetaKey.menuIcon],
    authFunc: item.meta[RouteMetaKey.authFunc],
    menuTitle: item.meta[RouteMetaKey.menuTitle],
  }
}
