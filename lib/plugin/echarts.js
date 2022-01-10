
// https://github.com/ecomfe/vue-echarts
import ECharts from "vue-echarts";
import { use } from "echarts/core"

// import ECharts modules manually to reduce bundle size
import {
  CanvasRenderer,
  SVGRenderer
} from 'echarts/renderers'
import {
  BarChart,PieChart,CustomChart,LineChart, ScatterChart
} from 'echarts/charts'
import {
  DataZoomComponent,ToolboxComponent,
  LegendComponent,VisualMapComponent,
  GridComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,SVGRenderer,
  BarChart,PieChart,CustomChart,LineChart, ScatterChart,
  GridComponent,
  TooltipComponent,DataZoomComponent,
  ToolboxComponent,LegendComponent,VisualMapComponent,
])

export default {
  install:function(Vue){
    Vue.component('v-chart',ECharts)
  }
}
