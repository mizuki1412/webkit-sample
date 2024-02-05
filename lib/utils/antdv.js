/**
 * 用于ant-design-vue的一些数据预置处理
 */
import dayjs from "dayjs";
import {formatDate, formatDateTime} from "./date";
import {toPinyin} from "../service";

// 时间的比较
export function antSortDate(dtKey){
  return (a,b)=>{
    let av = dayjs(a?a[dtKey]:null)
    let bv = dayjs(b?b[dtKey]:null)
    return (av.isValid()?av.valueOf():Number.MAX_SAFE_INTEGER) - (bv.isValid()?bv.valueOf():Number.MAX_SAFE_INTEGER)
  }
}

// 时间的值显示
export function antRenderDate(dtKey){
  return (params)=> params.record?formatDate(params.record[dtKey]):''
}

export function antRenderDateTime(dtKey){
  return (params)=> params.record?formatDateTime(params.record[dtKey]):''
}

// 一般的搜索逻辑
export function antCascaderFilter(){
  return {
    filter:(inputValue, path) => path.some(option => {
      const lower = option.label.toLowerCase()
      const lowerKeys = inputValue.toLowerCase()
      return ( lower.indexOf(lowerKeys)>-1 || toPinyin(lower).includes(lowerKeys) )
    })
  }
}

export function antTableFilter(key){
  return (value, record) => {
    if(!record[key] || !value || value==='') return false
    const lower = record[key].toLowerCase()
    const lowerKeys = value.toLowerCase()
    return ( lower.indexOf(lowerKeys)>-1 || toPinyin(lower).includes(lowerKeys) )
  }
}