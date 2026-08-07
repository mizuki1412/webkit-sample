import io from "socket.io-client"
import {pushErrMsg, storeErrMsg} from "../store"

let socket = null

const EventPublic = "event:public"

// 需要在最外层的main的onMounted中初始化
export function init(port) {
  socket = io(window.location.hostname + ":" + port)
  socket.on("connect", function () {
  })
  // 接收server传回的数据
  socket.on(EventPublic, function (data) {
    const json = JSON.parse(data)
    if (eventHandlers[json.code]) {
      eventHandlers[json.code](json)
    }
  })
}

/// key:code
const eventHandlers = {}

export function addHandler(code, fun) {
  eventHandlers[code] = fun
}

/// 重载配置项
export const RequestConfig = {
  errShowFunc(msg) {
    // Message.error(msg);
  },
}

export function request(code, data, config) {
  return new Promise(function (resolve, reject) {
    const payload = {code, data}
    socket.emit(EventPublic, JSON.stringify(payload), function (json) {
      const ret = JSON.parse(json)
      if (ret.result) {
        resolve(ret.data)
      } else {
        const showMsg = config.showMsg === null || config.showMsg === undefined || config.showMsg
        const throwable = config.throwable === null || config.throwable === undefined || config.throwable
        const msg = ret.message
        if (showMsg && msg) {
          pushErrMsg({
            src: code,
            msg,
          })
          // 如果未配置errMsgChannel则
          if (storeErrMsg.submitId === "") {
            RequestConfig.errShowFunc(msg)
          }
        }
        if (throwable) {
          throw new Error(msg)
        }
      }
    })
  })
}

// todo request和await的处理，以及http后await接收处理
