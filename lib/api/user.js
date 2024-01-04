import {request} from "../request"
import {configKit, rmStoreUserInfo} from "../store"

/// getUserInfo: 用户信息
export async function getUserInfo(params = {}){
  const {data} = await request(`/user/info`, params, {method: 'get'})
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
export async function getUserLogout(params = {}){
  const {data} = await request(`/user/logout`, params, {method: 'get'})
  return data.data
}

/// postUserUpdatePwd: 密码修改
// * oldPwd : string :
// * newPwd : string :
export async function postUserUpdatePwd(params = {oldPwd: null, newPwd: null}){
  const {data} = await request(`/user/updatePwd`, params, {method: 'post'})
  return data.data
}