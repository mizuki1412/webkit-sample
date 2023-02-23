import Qs from "qs"
import axios from "axios"
import {HttpHeader} from "./const"
import {pushErrMsg, storeErrMsg, configKit, storeUserInfo} from "../store"
import {ElMessage} from "element-plus"

export function setAxiosDefaultBaseUrl() {
  let baseUrl = configKit.requestBaseUrl
  if (baseUrl) {
    axios.defaults.baseURL = baseUrl
  }
}

/// 重载配置项
export const RequestConfig = {
  // 错误信息展示func
  errShowFunc(msg) {
    ElMessage({
      showClose: true,
      message: msg,
      type: "error",
    })
  },
  // 错误信息拦截处理
  errDataHandleFunc(e, config) {
    let auth = true
    if (config.auth === false) auth = false
    // 只处理result==2，其他交给catch
    if (auth && e.response && e.response.data && e.response.data.result === 2) {
      window.location.reload()
    }
    return true
  },
}

function errHandle(e, url, config) {
  const er = RequestConfig.errDataHandleFunc(e, config)
  if (!er) return
  let showMsg = true
  if (config.showMsg === false) showMsg = false
  let throwable = true
  if (config.throwable === false) throwable = false
  let response = e.response
  if (!response) {
    response = {}
  }
  const data = response.data
  const msg = data ? data.message : e.message
  // 接口错误后的json数据处理
  if (data) {
    if (showMsg && msg) {
      pushErrMsg({
        src: url,
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
  } else if (throwable) {
    // 有可能是cancel todo
    throw new Error(msg)
  }
  response.data = {
    message: msg,
    result: response.status,
  }
  return response
}

/**
 * 如果是上传，设置content-type
 * @param url
 * @param data object
 * @param config: showMsg, throwable, auth, axios_configs(https://github.com/axios/axios)
 */
export function request(url, data, config) {
  // 补全headers
  if (!config) config = {}
  if (!config.headers) config.headers = {}
  config.headers[HttpHeader.tokenKey] = storeUserInfo.token||''
  if (!config.headers[HttpHeader.contentTypeKey]) {
    config.headers[HttpHeader.contentTypeKey] = HttpHeader.contentTypeForm
  }
  if (!config.method) {
    config.method = "post"
  }
  let defaultConfig = {
    url,
    data,
    method: config.method,
    withCredentials: true,
    transformRequest: [
      function (data, headers) {
        // Do whatever you want to transform the data
        if (headers[HttpHeader.contentTypeKey] === HttpHeader.contentTypeForm) {
          data = Qs.stringify(data, {
            skipNulls: true,
          })
        } else if (
          headers[HttpHeader.contentTypeKey] === HttpHeader.contentTypeMultipart
        ) {
          const param = new FormData()
          for (const key of Object.keys(data)) {
            param.append(key, data[key])
          }
          data = param
        }
        return data
      },
    ],
  }
  // 构建 axios config
  for (let k of Object.keys(config)) {
    if (k !== "showMsg" && k !== "throwable") {
      defaultConfig[k] = config[k]
    }
  }
  return axios(defaultConfig).catch((e) => {
    return errHandle(e, url, config)
  })
}

/**
 * Download file
 * @param url request url
 * @param data request data
 * @param config filename, showMsg, throwable, axios_configs(https://github.com/axios/axios)
 */
export function download(url, data, config) {
  if(!config) config = {}
  config.responseType = 'blob'
  return request(url, data, config).then((response)=>{
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a');
      elink.download = config.filename;
      elink.style.display = 'none';
      elink.href = window.URL.createObjectURL(response.data);
      // console.log(blob)
      document.body.appendChild(elink);
      elink.click();
      window.URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else { // IE10+下载
      navigator.msSaveBlob(response.data, config.filename);
    }
  })
  // todo error handle
}

/**
 *
 * @param url
 * @param data file, etc
 * @param config showMsg, throwable, axios_configs(https://github.com/axios/axios)
 */
export function upload(url, data, config) {
  if (!config) config = {}
  if (!config.headers) config.headers = {}
  config.headers[HttpHeader.contentTypeKey] = HttpHeader.contentTypeMultipart
  if (config.throwable !== false) config.throwable = true
  return request(url, data, config)
}
