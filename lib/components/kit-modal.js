
import KitModal from './kit-modal.vue'
import KitErrChannel from "./kit-err-channel";

export default {
  install:function(Vue){
    // Vue.use(ElButton)
    // Vue.use(ElDialog)
    Vue.use(KitErrChannel)
    Vue.component('KitModal',KitModal)
  }
}
