import {deepMerge} from "./logic";

export function chartConfig(param) {
  let seriesLength = (param.series).length
  let dataMin = false
  let areashow = [0]
  for (let i = 0; i < seriesLength; i++) {
    if ((param.series)[i].type === 'line' || 'scatter') {
      dataMin = true
    }
    if ((param.series)[i].areaStyle) {
      areashow.push(1)
    } else {
      areashow.push(0)
    }
  }
  let tooltipval = false
  let tooltippoin = false
  if ((param.series).length === 1 && (param.series)[0].type === "pie") {
    tooltipval = true
  }
  for (const e of (param.series)) {
    if (e.type === "bar") {
      tooltippoin = true
      e.barMaxWidth = 40
      break
    }
  }
  const option = {
    color: colorArrays(),
    legend: {
      textStyle: {
        fontSize: 12,
      },
      top: "1%",
    },
    // xAxis:{
    //   axisLine: {
    //     lineStyle: {
    //     },
    //   },
    // },
    tooltip: {
      trigger: tooltipval ? 'item' : 'axis',
      axisPointer: {
        type: tooltippoin ? 'shadow' : 'line'
      }
    },
    grid: {
      //top: param.yAxis.length > 0 ? '7%' : '15%',
      top: '15%',
      bottom: '5%',
      left: '5%',
      right: '5%',
      containLabel: true,
    },
    series: []
  }
  if (!tooltipval) {//如果不是饼图就加上yAxis和xAxis
    if (param.yAxis && (param.yAxis).length > 0) {
      option.yAxis = [{}]
      // option.grid = {
      //   top: '25%', bottom: '25%', left: '15%',
      //   right: '10%',
      // }
    } else {
      option.yAxis = {
        type: 'value',
        axisLine: {
          lineStyle: {},
        },
        min: function (value) {
          if (dataMin) {
            if (value.min - (value.max - value.min) / 5 > 0) {
              return (value.min - (value.max - value.min) / 5).toFixed(0)
            } else {
              return 0
            }
          }
        }
      }
    }
    option.xAxis = {
      axisLine: {
        lineStyle: {},
      },
    }
  }
  deepMerge(option, param);
  //如果一个图里有折线并且有条形图
  if (!tooltipval && param.series && seriesLength > 1) {
    for (let i = 0; i < seriesLength - 1; i++) {
      if ((param.series)[0].type !== (param.series)[i + 1].type && !param.color) {
        option.color = colorArrays2()
      }
    }
  }
  for (let i = 1; i < areashow.length; i++) {
    if (areashow[i] === 1) {
      // todo
      // option.series[i - 1].areaStyle = {
      //   color: new (echarts).graphic.LinearGradient(0, 0, 0, 1, [{
      //     offset: 0,
      //     color: option.color[i - 1]
      //   }, {
      //     offset: 1,
      //     color: colorArrays()[i - 1]
      //   }]),
      // }
    }
  }
  return option;
}

function colorArrays(){
  return [ "#b4aee8", "#7BD5B6","#F1BC6A" ,"#9FE080","#9278E6","#BADAE8","#54ACF9","#e2bcb7", "#cee6b4" ]
}

function colorArrays2() {
  return [ "#9278E6","#5093C8", "#7BD5B6","#F1BC6A" ,"#4CD7AC"]
}
