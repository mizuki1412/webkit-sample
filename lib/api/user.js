import {request} from "../request"
import {configKit, rmStoreUserInfo} from "../store"

/// 用户信息. auth： request 处理中是否对未登录处理
export async function UserInfo(auth) {
  const config = {showMsg: false, throwable: false, auth}
  const {data} = await request("/rest/user/info", {schema: configKit.schema}, config)
  return data
}

/// 登出
export async function UserLogout() {
  rmStoreUserInfo()
  const config = {showMsg: false, throwable: false}
  await request("/rest/user/logout", config)
}

/// 密码修改
// * oldPwd : string :
// * newPwd : string :
export async function UserUpdatePwd(params) {
  const {data} = await request("/rest/user/updatePwd", params)
  return data.data
}

/// 登录
//  username : string : 用户名
//  phone : string : 手机号
// * pwd : string :
//  schema : string :
export async function UserLogin(params){
  const {data} = await request('/rest/user/login', params)
  return data.data
}
