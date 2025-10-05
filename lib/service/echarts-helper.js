import * as echarts from "echarts/core"
import _ from 'lodash'

// 提供默认grid
export function gridDemo(change){
  return {
    top: _.isNil(change?change.top:null)?30: change.top,
    left: _.isNil(change?change.left:null)?15: change.left,
    right: _.isNil(change?change.right:null)?20: change.right,
    bottom: _.isNil(change?change.bottom:null)?5: change.bottom,
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

// 柱状点击事件
export function triggerOnGridClick(vChartRef, xy, func = function (index) {}){
  if(!vChartRef.chart) throw Error("chart ref is null")
  vChartRef.chart.getZr().off('click');
  //注册区域的点击事件，解决数据较少时不方便点击柱状图的问题
  vChartRef.chart.getZr().on('click', function(param) {
    let pointInPixel= [param.offsetX, param.offsetY];
    if (vChartRef.chart.containPixel('grid',pointInPixel)) {
      //获取当前点击的索引值
      //注意：若柱状图为纵向则获取x轴的索引，若柱状图为横向则需获取y轴的索引(见下方注释)
      let index
      if(xy==='x'){
        index = vChartRef.chart.convertFromPixel({seriesIndex:0},[param.offsetX, param.offsetY])[0];
      }else{
        index = vChartRef.chart.convertFromPixel({seriesIndex:0},[param.offsetX, param.offsetY])[1];
      }
      func(index)
    }
  });
}