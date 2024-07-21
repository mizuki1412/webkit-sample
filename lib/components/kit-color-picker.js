import KitColorPicker from "./kit-color-picker.vue"
import '@simonwep/pickr/dist/themes/nano.min.css';

export default {
  install: function (Vue) {
    Vue.component("KitColorPicker", KitColorPicker)
  },
}
