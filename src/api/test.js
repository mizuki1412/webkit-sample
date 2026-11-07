import {request} from "web-frame/request"

export async function BoxList() {
  const {data} = await request("/rest/test/cmd")
  return data.data
}
