import {download, genGetUrl, request, upload} from "/lib/request"

/// postCommonFileList: 文件列表
// * path : string : 相对项目目录地址
export async function postCommonFileList(params = {path: null}){
  const {data} = await request(`/common/file/list`, params, {method: 'post'})
  return data.data
}

/// postCommonFileDel: 文件删除
// * path : string : 相对项目目录地址
export async function postCommonFileDel(params = {path: null}){
  const {data} = await request(`/common/file/del`, params, {method: 'post'})
  return data.data
}

/// postCommonUploadPrivate: 私有上传
// * file : string :
//  path : string : 相对项目目录地址
export async function postCommonUploadPrivate(params = {file: null, path: null}){
  await upload(`/common/upload/private`, params, {method: 'post'})
}

/// getCommonDownload: 公共下载
// * name : string :
export async function getCommonDownload(params = {name: null}, filename){
  await download(`/common/download`, params, {method: 'get', filename})
}

/// getCommonDownloadPrivate: 私有下载
// * name : string :
export async function getCommonDownloadPrivate(params = {name: null}, filename){
  await download(`/common/download/private`, params, {method: 'get',filename})
}

/// 列表所有的省市
export async function CommonAdministrativeListAllProvinceCity() {
  const {data} = await request(
    "/rest/common/administrative/listAllProvinceCity"
  )
  return data.data
}

/// 按市列出区
// * cityCode : string :
export async function CommonAdministrativeListAreaByCity(params) {
  const {data} = await request(
    "/rest/common/administrative/listAreaByCity",
    params
  )
  return data.data
}

/// postCommonStsGet: ali sts 获取
export async function postCommonStsGet(params = {}){
  const {data} = await request(`/common/sts/get`, params, {method: 'post'})
  return data.data
}


// 私有下载url
export function FileLinkPrivate(name) {
  return genGetUrl('/common/download/private', {name})
}
// 公共下载url
export function FileLink(name) {
  return genGetUrl('/common/download', {name})
}
