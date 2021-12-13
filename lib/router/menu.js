/**
 * 通过routes，解析出菜单项。
 */
import {reactive} from 'vue';

// IMenuItem {
//   name?: string;
//   path?: string;
//   children?: IMenuItem[];
///  meta定义下:
//    icon?: string;
//    authFunc?: Function;
//    menuTitle?: string;
// }
export const storePageMenu = reactive([]);

// route meta中的定义字段
export const RouteMetaKey = {
  menuIcon: "menuIcon",         // 图标信息
  authFunc: "authFunc",  // 访问权限，return bool
  authDisable: "authDisable", // 禁用登录拦截
  menuTitle: "menuTitle",
  menuBelong: "menuBelong", // 值为父menu的名称，将以此作为字段划分
  menuEx:"menuEx",  // bool, 不纳入menu
  menuTreeIndex: "menu", // bool, 表示此主路由将用于menu数据
}

// 根据路由生成menu数据
export function buildMenu(routes){
  // 筛选menu所在的主路由
  let rs = routes.filter(r=>r.meta&&r.meta[RouteMetaKey.menuTreeIndex])
  if(rs.length===0) return
  let mainRoute = rs[0]
  // 取主路由的children作为menu的数据源
  let children = mainRoute.children
  if(!children || children.length===0) return
  // 临时存放主menu
  let pool = {}
  // todo 目前只支持二级目录
  for(let item of children){
    if(!item.meta) item.meta = {}
    if(item.meta[RouteMetaKey.menuEx]) continue
    if(!item.meta[RouteMetaKey.menuBelong]){
      let newItem = _genNewItem(item)
      pool[newItem.name] = newItem
      storePageMenu.push(newItem)
    }else{
      // 子级
      if(pool[item.meta[RouteMetaKey.menuBelong]]){
        let newItem = _genNewItem(item)
        pool[item.meta[RouteMetaKey.menuBelong]].children.push(newItem)
      }
    }
  }

}

function _genNewItem(item){
  return {
    name: item.name,
    path: item.path,
    // 表示此item为分组，children为分组内的menu子项
    children: [],
    menuIcon: item.meta[RouteMetaKey.menuIcon],
    authFunc: item.meta[RouteMetaKey.authFunc],
    menuTitle: item.meta[RouteMetaKey.menuTitle]
  }
}
