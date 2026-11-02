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

// ---- 权限判定（与后端 tokenkit.Principal 的语义对齐） ----
// 数据形状：user.roles = [{id, privileges: string[]}]（多角色并集），
// user.extend.privilegeExclude = string[]（显式剔除，优先级最高）。
// 匹配规则（见后端 matchPrivilege）：
//   - 完全相等；
//   - "*" 覆盖一切；
//   - "user:*" 末段通配，命中 "user:" 前缀下任意深度；
//   - 中间段 "*" 该段通配，此时要求总段数相同。

/// matchPrivilege: 判断 granted 权限码是否命中 target
export function matchPrivilege(granted, target) {
  if (granted === target || granted === "*") return true
  if (!granted.includes("*")) return false
  const ps = granted.split(":")
  const ts = target.split(":")
  for (let i = 0; i < ps.length; i++) {
    if (ps[i] === "*") {
      // 末段通配：吞掉剩余所有层级
      if (i === ps.length - 1) return true
      continue
    }
    if (i >= ts.length || ts[i] !== ps[i]) return false
  }
  return ps.length === ts.length
}

/// userHasPrivilege: 单个权限判定——多角色并集命中，且未被 extend.privilegeExclude 剔除
export function userHasPrivilege(user, perm) {
  if (!user || !perm) return false
  const exclude = user.extend && user.extend.privilegeExclude
  if (exclude && exclude.length > 0) {
    for (const ex of exclude) {
      if (ex === perm || ex === "*") return false
    }
  }
  const roles = user.roles
  if (!roles || roles.length === 0) return false
  for (const role of roles) {
    const privileges = role && role.privileges
    if (!privileges) continue
    for (const granted of privileges) {
      if (matchPrivilege(granted, perm)) return true
    }
  }
  return false
}

export function checkPrivilege(ps, isAnd){
  if(ps && ps.length>0){
    if(!storeUserInfo.user) return false
    if(isAnd){
      // 与的关系：全部命中
      for (let p of ps){
        if(!userHasPrivilege(storeUserInfo.user, p)) return false
      }
      return true
    }else{
      // 或的关系：任一命中
      for (let p of ps){
        if(userHasPrivilege(storeUserInfo.user, p)) return true
      }
      return false
    }
  }else{
    return true
  }
}
