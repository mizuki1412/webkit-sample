import KitModal from "./kit-modal.vue"
import KitErrChannel from "./kit-err-channel"

// 毛玻璃遮罩配置，kit-modal 与命令式 Modal.* 共用同一份
export const modalFrostedMask = { backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }

export default {
  install: function (Vue) {
    Vue.use(KitErrChannel)
    Vue.component("KitModal", KitModal)
  },
}
