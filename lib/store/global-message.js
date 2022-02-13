// 可用于全局触发el-message-box的形式

import {reactive} from "vue";

export const storeGlobalMessage = reactive({
  trigger: false,
  title: null,
  content: null,
  handleOK: function (){},
  handleCancel: function (){}
})

export function clearStoreGlobalMessage(){
  storeGlobalMessage.trigger = false
  storeGlobalMessage.title = null
  storeGlobalMessage.content = null
  storeGlobalMessage.handleOK = function (){}
  storeGlobalMessage.handleCancel = function (){}
}
