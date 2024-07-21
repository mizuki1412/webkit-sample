/**
 * 用于ant-design-vue的一些数据预置处理
 */
import dayjs from "dayjs";
import {formatDate, formatDateTime} from "./date";
import {toPinyin} from "../service";
import {dayjsObj} from "./dayjs";
import {getObjValByKeys} from "./logic";

// 时间的比较
export function antSortDate(dtKey){
  return (a,b)=>{
    let va = getObjValByKeys(a, dtKey)
    let vb = getObjValByKeys(b, dtKey)
    let av = dayjs(a?va:null)
    let bv = dayjs(b?vb:null)
    return (av.isValid()?av.valueOf():Number.MAX_SAFE_INTEGER) - (bv.isValid()?bv.valueOf():Number.MAX_SAFE_INTEGER)
  }
}

export function antSortDefault(key){
  return (a,b)=>{
    let va = getObjValByKeys(a, key)
    let vb = getObjValByKeys(b, key)
    if(va === vb) return 0;
    return va > vb? 1:-1
  }
}

// 时间的值显示
export function antRenderDate(dtKey){
  return (params)=> {
    let v = getObjValByKeys(params.record, dtKey)
    return params.record?formatDate(v):''
  }
}

export function antRenderDateTime(dtKey){
  return (params)=> {
    let v = getObjValByKeys(params.record, dtKey)
    return params.record?formatDateTime(v):''
  }
}

export function antRenderDateWeek(dtKey){
  return (params)=> {
    let v = getObjValByKeys(params.record, dtKey)
    let dj = dayjsObj(v)
    return params.record && dj?dj.format("YY-MM-DD 周dd"):''
  }
}

// 序号
export function antRenderIndex(){
  return (params)=> params.index+1
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
    let v = getObjValByKeys(record, key)
    if(!v || !value || value==='') return false
    const lower = v.toLowerCase()
    const lowerKeys = value.toLowerCase()
    return ( lower.indexOf(lowerKeys)>-1 || toPinyin(lower).includes(lowerKeys) )
  }
}