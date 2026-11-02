// https://github.com/ecomfe/vue-echarts
import ECharts from "vue-echarts"
import {use} from "echarts/core"

// import ECharts modules manually to reduce bundle size
import {CanvasRenderer, SVGRenderer} from "echarts/renderers"
import {
  BarChart,
  PieChart,
  CustomChart,
  LineChart,
  ScatterChart,
} from "echarts/charts"
import {
  DataZoomComponent,
  ToolboxComponent,
  LegendComponent,
  VisualMapComponent,
  GridComponent,
  TooltipComponent,
} from "echarts/components"

use([
  CanvasRenderer,
  SVGRenderer,
  BarChart,
  PieChart,
  CustomChart,
  LineChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  ToolboxComponent,
  LegendComponent,
  VisualMapComponent,
])

// 默认导出为 install 插件（app.use 全局注册 v-chart）。
// 推荐用法：在使用页面 `import VChart from "/lib/plugin/echarts/components"`
// 局部引入，避免 echarts 进首屏主包。
export default {
  install: function (Vue) {
    Vue.component("v-chart", ECharts)
  },
}

// 具名导出：页面级局部引入用的组件本体
export {ECharts}
