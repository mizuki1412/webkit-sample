import { request } from "/lib/request"

/// 列表所有的省市
export async function CommonAdministrativeListAllProvinceCity() {
  const { data } = await request(
    "/rest/common/administrative/listAllProvinceCity"
  )
  return data.data
}

/// 按市列出区
// * cityCode : string :
export async function CommonAdministrativeListAreaByCity(params) {
  const { data } = await request(
    "/rest/common/administrative/listAreaByCity",
    params
  )
  return data.data
}

/// ali sts 获取
export async function StsGet() {
  const { data } = await request("/rest/sts/get")
  return data.data
}
