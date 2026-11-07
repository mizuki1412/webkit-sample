import {reactive} from "vue"
import {configKit} from "./configkit";

export const storeUserInfo = reactive({
  user: undefined,
  token: undefined,
  redirect: undefined,
  // expire: undefined,
  // setting: undefined,
})

export function initToken() {
  const token = localStorage.getItem(configKit.appName + '-token');
  if (token) {
    storeUserInfo.token = token
  }
}

export function updateStoreUserInfo(data) {
  storeUserInfo.user = data.user
  storeUserInfo.token = data.token
  // storeUserInfo.expire = new Date().getTime() + 1000 * 60 * 60 * 20;
  if(data.token) localStorage.setItem(configKit.appName + '-token', storeUserInfo.token);
}

export function rmStoreUserInfo() {
  for (const key in storeUserInfo) {
    delete storeUserInfo[key]
  }
  localStorage.removeItem(configKit.appName + '-token');
}

// 权限判定（matchPrivilege/userHasPrivilege/checkPrivilege）属后端权限模型语义，
// 不在核心层：go-frame 的实现（tokenkit.Principal 前端镜像）见 lib/backend/go-frame/principal.js。
// 核心层只提供会话状态与 authFunc 约定，由路由 meta / 菜单过滤消费。
