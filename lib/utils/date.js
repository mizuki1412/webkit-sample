import _ from "lodash"

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
  if (_.isNaN(_.toNumber(ms))) {
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
    DD && (ret += _.padStart(_.toString(day),2,'0'))
    DD && hh && (ret += ":")
    hh && (ret += _.padStart(_.toString(hour),2,'0'))
    hh && mm && (ret += ":")
    mm && (ret += _.padStart(_.toString(min),2,'0'))
    mm && ss && (ret += ":")
    ss && (ret += _.padStart(_.toString(sec),2,'0'))
    ss && (mmm || m) && (ret += ".")
    mmm && (ret += _.padStart(_.toString(ms), 3,'0'))
    m && (ret += _.padStart(_.toString(ms), 1,'0'))
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
    _.padStart(_.toString(d.getMonth() + 1), 2, '0')
  )
}

export function formatDate(str) {
  let d = date(str)
  if(!d) return null
  return (
    d.getFullYear() +
    "-" +
    _.padStart(_.toString(d.getMonth() + 1), 2, '0') +
    "-" +
    _.padStart(_.toString(d.getDate()),2,'0')
  )
}

export function formatTime(str) {
  let d = date(str)
  if(!d) return null
  const h = _.padStart(_.toString(d.getHours()),2,'0')
  const m = _.padStart(_.toString(d.getMinutes()),2,'0')
  const s = _.padStart(_.toString(d.getSeconds()),2,'0')
  return h + ":" + m + ":" + s
}

export function formatTimeHM(str) {
  let d = date(str)
  if(!d) return null
  const h = _.padStart(_.toString(d.getHours()),2,'0')
  const m = _.padStart(_.toString(d.getMinutes()),2,'0')
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
