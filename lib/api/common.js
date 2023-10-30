import {download, request, upload} from "/lib/request"
import {configKit} from "../store";

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

/// ali sts 获取
export async function StsGet() {
  const {data} = await request("/rest/sts/get")
  return data.data
}

/// 公共下载
// * name : string :, config.filename
export async function CommonDownload(params,filename){
  await download('/rest/common/download', params,{filename})
}

/// 获取服务器时间
export async function CommonTime(){
  const {data} = await request('/rest/common/time')
  return data.data
}

/// 私有下载
// * name : string :; config.filename
export async function Download(params,filename){
  await download('/rest/download', params,{filename})
}

/// 私有上传
// * file :
// path: 相对项目目录路径
export async function Upload(params){
  await upload('/rest/upload', params)
}

/// 获取目录文件列表
// path: 相对项目目录路径
export async function ListFileNames(params){
  const {data} = await request('/rest/file/list', params)
  return data.data
}

/// 删除文件
// path: 相对项目目录路径
export async function DelFile(params){
  const {data} = await request('/rest/file/del', params)
  return data.data
}

// 私有下载url
export function FileLinkPrivate(path, dt) {
  if (path) { return configKit.requestBaseUrl + '/rest/download?name=' + path + (dt ? ('&dt=' + dt?dt.getTime():null) : ''); }
}
// 公共下载url
export function FileLink(path, dt) {
  if (path) { return configKit.requestBaseUrl + '/rest/common/download?name=' + path + (dt ? ('&dt=' + dt?dt.getTime():null) : ''); }
}
