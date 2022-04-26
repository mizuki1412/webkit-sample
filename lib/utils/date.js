import {leftFill0} from "./index"

const {floor} = Math

function _resolveFormatter(formatter) {
  const tokens = formatter
    .split(/[\.\:]/)
    .filter((token) => token.trim())
    .filter(Boolean)
    .map((token) => [token, true])
  return new Map(tokens)
}

/**
 * 格式化毫秒数
 * @param ms
 * @param zh：是否中文
 * @param formatterStr
 */
export function formatMilliseconds(ms, zh, formatterStr = "hh:mm:ss") {
  if (isNaN(Number(ms))) {
    return "- -"
  }

  const formatter = _resolveFormatter(formatterStr)
  const MM = formatter.get("MM")
  const DD = formatter.get("DD")
  const hh = formatter.get("hh")
  const mm = formatter.get("mm")
  const ss = formatter.get("ss")
  const mmm = formatter.get("mmm")
  const m = formatter.get("m")

  ms = floor(ms)
  let day = floor(floor(ms / 3600000) / 24)
  let hour = floor(ms / 3600000)
  let min = floor(ms / 60000)
  let sec = floor(ms / 1000)
  day = MM ? day % 30 : day
  hour = DD ? hour % 24 : hour
  min = mm ? min % 60 : min
  sec = ss ? sec % 60 : sec
  ms = mmm ? ms % 1000 : ms
  ms = m ? floor((ms % 1000) / 100) : ms

  let ret = ""
  if (zh) {
    DD && (ret += day + "天")
    hh && (ret += hour + "时")
    mm && (ret += min + "分")
    ss && (ret += sec + "秒")
    mmm && (ret += ms + "毫秒")
  } else {
    DD && (ret += leftFill0(day))
    DD && hh && (ret += ":")
    hh && (ret += leftFill0(hour))
    hh && mm && (ret += ":")
    mm && (ret += leftFill0(min))
    mm && ss && (ret += ":")
    ss && (ret += leftFill0(sec))
    ss && (mmm || m) && (ret += ".")
    mmm && (ret += leftFill0(ms, 3))
    m && (ret += leftFill0(ms, 1))
  }
  return ret
}

export function date(str){
  if (!str) return null
  if (!(str instanceof Date)) {
    // .replace(/\-/g, '/'
    return new Date(str)
  }else{
    return str
  }
}

export function formatYearMonth(str) {
  let d = date(str)
  if(!d) return null
  return (
    d.getFullYear() +
    "-" +
    leftFill0(d.getMonth() + 1)
  )
}

export function formatDate(str) {
  let d = date(str)
  if(!d) return null
  return (
    d.getFullYear() +
    "-" +
    leftFill0(d.getMonth() + 1) +
    "-" +
    leftFill0(d.getDate())
  )
}

export function formatTime(str) {
  let d = date(str)
  if(!d) return null
  const h = leftFill0(d.getHours())
  const m = leftFill0(d.getMinutes())
  const s = leftFill0(d.getSeconds())
  return h + ":" + m + ":" + s
}

export function formatTimeHM(str) {
  let d = date(str)
  if(!d) return null
  const h = leftFill0(d.getHours())
  const m = leftFill0(d.getMinutes())
  return h + ":" + m
}

export function formatDateTime(str) {
  let d = date(str)
  if(!d) return null
  return formatDate(d) + " " + formatTime(d)
}

export function clearHMS(dt) {
  dt.setHours(0)
  dt.setMinutes(0)
  dt.setSeconds(0)
  dt.setMilliseconds(0)
}

/**
 * 一个对象，根据数字得到中文， 0为星期日
 */
export const weekMap = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

/**
 * 获取当前时间的格式化对象
 */
export function getClock() {
  const dt = new Date()
  return {
    dt: formatDate(dt),
    week: weekMap[dt.getDay()],
    time: formatTime(dt),
  }
}

/**
 * 根据dt获取其所在的一周时间范围 7天
 * @param dt
 */
export function getWeekDaysRange(dt) {
  clearHMS(dt)
  // 0-周日，6-周一
  const dt1 = new Date()
  dt1.setTime(dt.getTime())
  let day = dt.getDay()
  if (day === 0) {
    day = 7
  }
  dt1.setDate(dt.getDate() - day + 1)
  const res = [dt1]
  for (let i = 1; i < 7; i++) {
    res.push(datePlus(dt1, i))
  }
  return res
}

function datePlus(dt, plus) {
  const res = new Date(dt.getTime())
  res.setDate(res.getDate() + plus)
  return res
}
