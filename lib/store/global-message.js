import {reactive} from "vue"

export const storeGlobalMessage = reactive({
  trigger: false,
  title: null,
  content: null,
  error: null,
  handleOK: function () {
  },
  handleCancel: function () {
  },
})

export function clearStoreGlobalMessage() {
  storeGlobalMessage.trigger = false
  storeGlobalMessage.title = null
  storeGlobalMessage.content = null
  storeGlobalMessage.error = null
  storeGlobalMessage.handleOK = function () {
  }
  storeGlobalMessage.handleCancel = function () {
  }
}

export const uploadProcess = reactive({
  show: false,
  process: 0,
  obj: undefined
})