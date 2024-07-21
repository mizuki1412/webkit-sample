import {request} from "../request"
import {configKit, rmStoreUserInfo} from "../store"

/// getUserInfo: 用户信息
export async function getUserInfo(auth=true){
  const config = {showMsg: false, throwable: false, auth, method: 'get'}
  const {data} = await request(`/user/info`, {schema: configKit.schema}, config)
  return data.data
}

/// postUserLogin: 登录
//  username : string : 用户名
//  phone : string : 手机号
// * pwd : string :
//  schema : string :
export async function postUserLogin(params = {username: null, phone: null, pwd: null, schema: "public"}){
  const {data} = await request(`/user/login`, params, {method: 'post'})
  return data.data
}

/// getUserLogout: 登出
export async function getUserLogout(){
  rmStoreUserInfo()
  const config = {showMsg: false, throwable: false, method: 'get'}
  await request(`/user/logout`, null, config)
}

/// postUserUpdatePwd: 密码修改
// * oldPwd : string :
// * newPwd : string :
export async function postUserUpdatePwd(params = {oldPwd: null, newPwd: null}){
  const {data} = await request(`/user/updatePwd`, params, {method: 'post'})
  return data.data
}