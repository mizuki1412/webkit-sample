
import KitErrChannel from './kit-err-channel.vue'
import {ElAlert} from "element-plus";

export default {
  install:function(Vue){
    Vue.use(ElAlert)
    Vue.component('KitErrChannel',KitErrChannel)
  }
}
