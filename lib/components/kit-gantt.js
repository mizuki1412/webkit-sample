import KitGantt from "./kit-gantt.vue"
import "dhtmlx-gantt/codebase/dhtmlxgantt.css"

export default {
  install: function (Vue) {
    Vue.component("KitGantt", KitGantt)
  },
}
