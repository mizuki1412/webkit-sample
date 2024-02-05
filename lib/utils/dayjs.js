
// 转为dayjs
import dayjs from "dayjs";

export function dayjsObj(str){
  let v = dayjs(str)
  if(v.isValid()) return v
  return null
}

export function dayjsValue(str) {
  let dj = dayjsObj(str)
  if(dj) return dj.valueOf()
  return null
}