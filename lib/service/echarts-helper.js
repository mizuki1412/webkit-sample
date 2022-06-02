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
  // if(option.grid.bottom===undefined){
  //   option.grid.bottom = 20
  // }
  // if(option.grid.top===undefined){
  //   option.grid.top = 25
  // }
  // let dataMin = false
  // let areashow = [0]
  // if(param.series){
  //   for(let e of param.series){
  //     if (e.type === 'line' || 'scatter') {
  //       dataMin = true
  //     }
  //     if (e.areaStyle) {
  //       areashow.push(1)
  //     } else {
  //       areashow.push(0)
  //     }
  //   }
  // }
  // let tooltipval = false
  // let tooltippoin = false
  // if ((param.series).length === 1 && (param.series)[0].type === "pie") {
  //   tooltipval = true
  // }
  // for (const e of (param.series)) {
  //   if (e.type === "bar") {
  //     tooltippoin = true
  //     e.barMaxWidth = 40
  //     break
  //   }
  // }
  // const option = {
  //   color: colorArrays(),
  //   legend: {
  //     textStyle: {
  //       fontSize: 12,
  //     },
  //     top: "1%",
  //   },
  //   // xAxis:{
  //   //   axisLine: {
  //   //     lineStyle: {
  //   //     },
  //   //   },
  //   // },
  //   tooltip: {
  //     trigger: tooltipval ? 'item' : 'axis',
  //     axisPointer: {
  //       type: tooltippoin ? 'shadow' : 'line'
  //     }
  //   },
  //   grid: {
  //     //top: param.yAxis.length > 0 ? '7%' : '15%',
  //     top: '15%',
  //     bottom: '5%',
  //     left: '5%',
  //     right: '5%',
  //     containLabel: true,
  //   },
  //   series: []
  // }
  // if (!tooltipval) {//如果不是饼图就加上yAxis和xAxis
  //   if (param.yAxis && (param.yAxis).length > 0) {
  //     option.yAxis = [{}]
  //     // option.grid = {
  //     //   top: '25%', bottom: '25%', left: '15%',
  //     //   right: '10%',
  //     // }
  //   } else {
  //     option.yAxis = {
  //       type: 'value',
  //       axisLine: {
  //         lineStyle: {},
  //       },
  //       min: function (value) {
  //         if (dataMin) {
  //           if (value.min - (value.max - value.min) / 5 > 0) {
  //             return (value.min - (value.max - value.min) / 5).toFixed(0)
  //           } else {
  //             return 0
  //           }
  //         }
  //       }
  //     }
  //   }
  //   option.xAxis = {
  //     axisLine: {
  //       lineStyle: {},
  //     },
  //   }
  // }
  // deepMerge(option, param);
  // //如果一个图里有折线并且有条形图
  // if (!tooltipval && param.series && seriesLength > 1) {
  //   for (let i = 0; i < seriesLength - 1; i++) {
  //     if ((param.series)[0].type !== (param.series)[i + 1].type && !param.color) {
  //       option.color = colorArrays2()
  //     }
  //   }
  // }
  // for (let i = 1; i < areashow.length; i++) {
  //   if (areashow[i] === 1) {
  //     // option.series[i - 1].areaStyle = {
  //     //   color: new (echarts).graphic.LinearGradient(0, 0, 0, 1, [{
  //     //     offset: 0,
  //     //     color: option.color[i - 1]
  //     //   }, {
  //     //     offset: 1,
  //     //     color: colorArrays()[i - 1]
  //     //   }]),
  //     // }
  //   }
  // }
  // console.log(option)
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
