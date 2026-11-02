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

/// postUserLogout: 登出
// 后端为 POST /user/logout（状态变更操作）；先请求成功再清本地，
// 顺序反了会因请求头无 token 导致服务端会话销毁失败（假登出）。
export async function postUserLogout(){
  const config = {showMsg: false, throwable: false, method: 'post'}
  try {
    await request(`/user/logout`, null, config)
  } finally {
    // 请求失败（如会话已过期 401）也要清本地，保证 UI 回到未登录态
    rmStoreUserInfo()
  }
}

/// postUserUpdatePwd: 密码修改
// * oldPwd : string :
// * newPwd : string :
export async function postUserUpdatePwd(params = {oldPwd: null, newPwd: null}){
  const {data} = await request(`/user/updatePwd`, params, {method: 'post'})
  return data.data
}

/// postUserAdminList: 用户管理列表（服务端分页）
//  departmentIds : number[] : 按部门过滤
//  roleIds : number[] : 按角色过滤
//  pageNum : number : 页码，从 1 起
//  pageSize : number : 每页条数，<=0 不分页返回全量
export async function postUserAdminList(params = {departmentIds: null, roleIds: null, pageNum: 1, pageSize: 10}){
  const {data} = await request(`/user/admin/list`, params, {method: 'post'})
  return data
}
