
import KitModal from './kit-modal.vue'
import {KitErrChannel} from "./index";

export default {
  install:function(Vue){
    // Vue.use(ElButton)
    // Vue.use(ElDialog)
    Vue.use(KitErrChannel)
    Vue.component('KitModal',KitModal)
  }
}
