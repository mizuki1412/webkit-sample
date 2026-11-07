import Qs from "qs"
import axios from "axios"
import {HttpHeader} from "./const"
import {configKit, pushErrMsg, rmStoreUserInfo, storeErrMsg, storeUserInfo} from "../store"
import {message} from 'antdv-next';

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
    // 不用message.useMessage()，不在页面上下文
    message.error(msg)
  },
  // 错误信息拦截处理
  errDataHandleFunc(e, config) {
    // 登录失效（401）：清本地会话并跳登录页，带 redirect 以便登录后回来。
    // 不用 window.location.reload()——reload 会重新执行当前页面，若页面又在拉
    // 需登录的接口，就形成 401→reload→401 的死循环。
    if (config.auth && e.response && e.response.data && e.response.data[RequestConfig.defaultKeyCode] === this.defaultCodeAuthFail) {
      rmStoreUserInfo()
      // 避免重复跳转（并发多个请求同时 401）
      if (!window.location.hash.includes("/login") && !window.location.pathname.endsWith("/login")) {
        const redirect = window.location.pathname + window.location.search + window.location.hash
        window.location.href = "/login?redirect=" + encodeURIComponent(redirect)
      }
      return false
    }
    // 403（权限不足）等其余错误交给 catch/errMsgChannel 提示，不做整页动作
    return true
  },
  // 默认content-type
  defaultContentType: HttpHeader.contentTypeForm,
  defaultCodeSuccess: 0,
  defaultCodeAuthFail: 401,
  defaultKeyCode: 'result',
  defaultKeyMsg: 'message',
  defaultKeyData: 'data',
  // 报文加密钩子（后端专属能力，由适配器按需注入，如 go-frame 的 payloadCryptoEnable；
  // null = 不加密，request() 行为不变）。契约：
  //   encKeyHeader                        加密密钥头名（请求/响应共用一把密钥材料）
  //   match(url) → bool                   该 url 是否需要加密
  //   async begin(url) → enc              生成密钥材料与 encKey 头值，失败应 throw（走统一错误提示）
  //   encryptBody(key, jsonText) → body   JSON 明文 → 加密请求体
  //   decryptResponse(resp, enc)          就地解密 resp.data；非加密响应必须原样放行
  //   isDecryptFail(data) → bool          响应是否为「密钥对不上」（true 时核心层清钥重试一次）
  //   clearKeys()                         清密钥缓存，下个请求重新握手
  payloadCodec: null,
}

function errHandle(e, url, config) {
  const er = RequestConfig.errDataHandleFunc(e, config)
  if (!er) return
  let response = e.response
  if (!response) {
    response = {}
  }
  const data = response.data
  const msg = data ? (data[RequestConfig.defaultKeyMsg]? data[RequestConfig.defaultKeyMsg]: JSON.stringify(data)) : e.message
  if (config.showMsg && msg) {
    pushErrMsg({
      src: url,
      msg,
    })
    // 如果未配置errMsgChannel则
    if (storeErrMsg.submitId === "") {
      RequestConfig.errShowFunc(msg)
    }
  }
  if (config.throwable) {
    throw new Error(msg)
  }
  response.data = {}
  response.data[RequestConfig.defaultKeyMsg] = msg
  response.data[RequestConfig.defaultKeyCode] = response.status
  return response
}

/**
 * 如果是上传，设置content-type
 * post默认json，通过header控制
 * @param url
 * @param data object
 * @param config  showMsg, throwable, auth, axios_configs(https://github.com/axios/axios)
 */
export async function request(url, data, config = {headers:{}, method: 'post', auth: true, showMsg:true, throwable:true}) {
  // 补全headers
  if (!config) config = {}
  if (!config.headers) config.headers = {}
  if(!config.headers[HttpHeader.tokenKey]) config.headers[HttpHeader.tokenKey] = storeUserInfo.token||''
  if (!config.headers[HttpHeader.contentTypeKey]) {
    config.headers[HttpHeader.contentTypeKey] = RequestConfig.defaultContentType
  }
  if (!config.method) {
    config.method = "post"
  }
  if(config.method.toLowerCase()==='get'){
    config.headers[HttpHeader.contentTypeKey] = HttpHeader.contentTypeForm
  }
  if (config.auth===undefined) config.auth = true
  if (config.showMsg===undefined) config.showMsg = true
  if (config.throwable===undefined) config.throwable = true
  // 报文加密（需适配器 install 时注入 RequestConfig.payloadCodec）：JSON 请求体加密为信封、
  // 加密响应自动解密；上传(multipart)/下载(blob) 不适用，原样发送。
  // GET 无请求体但仍带密钥头——后端仅挂 EncryptResponse 时响应解密也靠它。
  let enc = null
  const codec = RequestConfig.payloadCodec
  if (codec && codec.match(url) && config.responseType !== 'blob' && config.headers[HttpHeader.contentTypeKey] !== HttpHeader.contentTypeMultipart) {
    try {
      enc = await codec.begin(url)
    } catch (e) {
      // 密钥握手/加密初始化失败（后端未启用报文加密或网络异常）：与 errHandle 一致的提示后上抛
      const msg = e && e.message ? e.message : "报文加密初始化失败"
      if (config.showMsg) {
        pushErrMsg({src: url, msg})
        if (storeErrMsg.submitId === "") {
          RequestConfig.errShowFunc(msg)
        }
      }
      throw new Error(msg)
    }
    config.headers[codec.encKeyHeader] = enc.encKey
  }
  let defaultConfig = {
    url,
    data: config.method.toLowerCase()!=='get'?data:null,
    params: config.method.toLowerCase()==='get'?data:null,
    method: config.method,
    withCredentials: true,
    transformRequest: config.method.toLowerCase()==='get'?[]:[
      function (data, headers) {
        // Do whatever you want to transform the data
        if (headers[HttpHeader.contentTypeKey] === HttpHeader.contentTypeForm) {
          data = Qs.stringify(data, {
            skipNulls: true,
          })
        } else if (headers[HttpHeader.contentTypeKey] === HttpHeader.contentTypeMultipart) {
          const param = new FormData()
          for (const key of Object.keys(data)) {
            param.append(key, data[key])
          }
          data = param
        }else{
          data = JSON.stringify(data)
          if (enc) {
            // JSON 请求体加密为信封（后端 DecryptRequest 解密后强制按 JSON 绑定，非 JSON 内容不加密）
            data = codec.encryptBody(enc.key, data)
          }
        }
        return data
      },
    ],
  }
  // 构建 axios config
  for (let k of Object.keys(config)) {
    if (["showMsg","throwable", "auth", "_pcRetry"].indexOf(k)<0 ) {
      defaultConfig[k] = config[k]
    }
  }
  const response = await axios(defaultConfig).then(async (resp) => {
    if (codec) codec.decryptResponse(resp, enc)
    // 密钥轮换自愈：服务端重启换钥后旧密钥加密的请求报「报文解密失败」，
    // 清密钥缓存整请求重试一次（换新钥 + 新密钥材料）
    if (codec && enc && !config._pcRetry && codec.isDecryptFail(resp.data)) {
      codec.clearKeys()
      return request(url, data, {...config, _pcRetry: true})
    }
    return resp
  }).catch((e) => {
    // 错误响应也可能是加密信封（如加密链路内的 403/业务错误），解密后再走既有错误处理
    if (codec) codec.decryptResponse(e && e.response, enc)
    return errHandle(e, url, config)
  })
  if(response.data[RequestConfig.defaultKeyCode]!==RequestConfig.defaultCodeSuccess){
    // 错误处理
    return errHandle({response}, url, config)
  }else{
    return response
  }
}

/**
 * Download file
 * @param url request url
 * @param data request data
 * @param config filename, showMsg, throwable, axios_configs(https://github.com/axios/axios)
 */
export function download(url, data, config={auth: true, showMsg:true, throwable:true, filename:null}) {
  if(!config) config = {}
  config.responseType = 'blob'
  return request(url, data, config).then((response)=>{
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a');
      if(!config.filename){
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = response.headers["content-disposition"].match(filenameRegex);
        if (matches) {
          config.filename = decodeURIComponent(matches[1].replace(/\"/g, ''));
        }
      }
      elink.download = config.filename;
      elink.style.display = 'none';
      elink.href = window.URL.createObjectURL(response.data);
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

export function genGetUrl(urlPath, data={}, config={urlPrefix:null, addTime:true}){
  if(!config.urlPrefix) config.urlPrefix=configKit.requestBaseUrl
  if(config.addTime) data["_time"]=new Date().getTime()
  return config.urlPrefix + urlPath + "?" + Qs.stringify(data, {
    skipNulls: true,
  })
}