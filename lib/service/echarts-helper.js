import * as echarts from "echarts/core"
import _ from 'lodash'

// 提供默认grid
export function gridDemo(change){
  return {
    top: _.isNil(change?.top)?30: change.top,
    left: _.isNil(change?.left)?15: change.left,
    right: _.isNil(change?.right)?20: change.right,
    bottom: _.isNil(change?.bottom)?5: change.bottom,
  }
}

// config.darkTheme boolean 是否用暗色模式
export function chartConfig(option, config) {
  option.grid = _.merge( {
    containLabel:true
  },option.grid)
  if (!config) config = {}
  // tooltip
  let tooltipval = false
  let tooltippoin = false
  if (option.series && option.series.length === 1 && option.series[0].type === "pie") {
    tooltipval = true
  }
  for (const e of option.series) {
    if (e.type === "bar") {
      tooltippoin = true
      e.barMaxWidth = 40
      break
    }
  }
  option.tooltip = _.merge( {
    trigger: tooltipval ? 'item' : 'axis',
      axisPointer: {
      type: tooltippoin ? 'shadow' : 'line'
    }
  },option.tooltip)
  // dark theme
  if(config.darkTheme){
    let themeObj = {}
    if (option.legend){
      themeObj.legend = {
        textStyle: {
          color: '#c7d1dd'
        }
      }
    }
    if (option.xAxis){
      themeObj.xAxis = {
        axisLine: {
          lineStyle: {
            color: '#c7d1dd'
          }
        },
        axisLabel:{
          color: '#c7d1dd'
        },
        nameTextStyle: {
          color: '#c7d1dd'
        }
      }
    }
    if (option.yAxis){
      themeObj.yAxis = {
        axisLine: {
          lineStyle: {
            color: '#c7d1dd'
          }
        },
        axisLabel:{
          color: '#c7d1dd'
        },
        nameTextStyle: {
          color: '#c7d1dd'
        }
      }
    }
    option = _.merge(option,themeObj)
  }
  return option
}

// 判断series中是否包含数据
export function chartSeriesDataExist(option) {
  if (option && option.series) {
    for (let d of option.series) {
      if (d.data && d.data.length > 0) {
        return true
      }
    }
  }
  return false
}

// 计算最大最小值 {max,min}
export function computeMaxMin(data) {
  let max = undefined
  let min = undefined
  for (let e of data) {
    if (e instanceof Array) {
      for (let ee of e) {
        if (max === undefined || max < ee) max = ee
        if (min === undefined || min > ee) min = ee
      }
    } else {
      if (max === undefined || max < e) max = e
      if (min === undefined || min > e) min = e
    }
  }
  return {max, min}
}

export function chartColor1(startIndex) {
  if (startIndex >= 8) startIndex = startIndex % 8
  let origin = [
    "#0ea5e9",
    "#f97316",
    "#14b8a6",
    "#fb7185",
    "#4ade80",
    "#d946ef",
    "#84cc16",
    "#8b5cf6",
  ]
  if (!startIndex) return origin
  else {
    let fin = [origin[startIndex]]
    let start = startIndex + 1
    while (start % 8 !== startIndex) {
      fin.push(origin[start % 8])
      start++
    }
    return fin
  }
}

// 从chartColor1中取隔2的两个颜色
export function linearColor1(chartColor1StartIndex) {
  let colors = chartColor1()
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {offset: 0, color: colors[chartColor1StartIndex]},
    {offset: 1, color: colors[(chartColor1StartIndex + 4) % colors.length]},
  ])
}

export function linearColorGreen() {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {offset: 0, color: "#14b8a6"},
    {offset: 1, color: "#84cc16"},
  ])
}

export function linearColorCyan() {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {offset: 0, color: "#09aeb9"},
    {offset: 1, color: "#43eec6"},
  ])
}

export function linearColorOrange() {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {offset: 0, color: "#ff6c6c"},
    {offset: 1, color: "#ffc326"},
  ])
}

export function linearColorBlue() {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    {offset: 0, color: "#0059e1"},
    {offset: 1, color: "#00d2d9"},
  ])
}
