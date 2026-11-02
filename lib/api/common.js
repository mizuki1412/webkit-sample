import {download, genGetUrl, request, upload} from "/lib/request"

/// postCommonUpload: 上传文件
// * file : File : 文件对象
//  public : bool : true 存公共目录（下载免鉴权），false 存私有目录
//  folder : string : common 下子目录，可选
// 返回 {path}：相对项目目录的路径，用于下载/删除/列表回显
export async function postCommonUpload(params = {file: null, public: true, folder: null}){
  const {data} = await upload(`/common/upload`, params, {method: 'post'})
  return data.data
}

/// postCommonFileList: 文件列表
//  sub : string : 子目录过滤 public/private，空为全部
export async function postCommonFileList(params = {sub: null}){
  const {data} = await request(`/common/file/list`, params, {method: 'post'})
  return data.data
}

/// postCommonFileDel: 文件删除（需 common:file 权限）
// * path : string : 列表接口返回的 path
export async function postCommonFileDel(params = {path: null}){
  const {data} = await request(`/common/file/del`, params, {method: 'post'})
  return data.data
}

/// getCommonDownload: 公共下载（免鉴权）
// * path : string : 相对项目目录的路径
export async function getCommonDownload(params = {path: null}, filename){
  await download(`/common/download`, params, {method: 'get', filename})
}

/// getCommonDownloadPrivate: 私有下载（须登录）
// * path : string : 相对项目目录的路径
export async function getCommonDownloadPrivate(params = {path: null}, filename){
  await download(`/common/download/private`, params, {method: 'get', filename})
}

// 私有下载url（<a href> / <img src> 直接可用，浏览器自动带 cookie）
export function FileLinkPrivate(path) {
  return genGetUrl('/common/download/private', {path})
}
// 公共下载url
export function FileLink(path) {
  return genGetUrl('/common/download', {path})
}
