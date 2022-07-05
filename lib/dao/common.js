import {download, request} from "/lib/request"
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
// * name : string :
export async function CommonDownload(params){
  await download('/rest/common/download', params)
}

/// 获取服务器时间
export async function CommonTime(){
  const {data} = await request('/rest/common/time')
  return data.data
}

/// 私有下载
// * name : string :
export async function Download(params){
  await download('/rest/download', params)
}

export function ImageLink(path, dt) {
  if (path) { return configKit.requestBaseUrl + '/rest/download?name=' + path + (dt ? ('&dt=' + dt?.getTime()) : ''); }
}
