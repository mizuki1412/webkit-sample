/**
 * go-frame 后端适配器：webkit 核心层（lib 顶层目录）默认对接的后端标准。
 *
 * 契约（编写其他后端适配器时对齐，见 lib/AGENTS.md）：
 *   name        适配器标识
 *   install()   装配钩子：注册 setBackend + 注入 RequestConfig 协议键 + 注入路由登录校验
 *   user        会话/用户能力：getUserInfo/login/logout/updatePwd/adminList
 *   file        文件能力：upload/list/del/download/downloadPrivate/link/linkPrivate
 *   page        分页适配：parse(ret, currentPage, pageSize) → kit-pagination-page 约定
 *   crypto      可选增强：enable/disable（go-frame 为 RSA+AES 报文加密）
 *
 * app 侧统一从本入口取用：
 *   import {goFrameBackend, postUserLogin, parsePage, checkPrivilege} from "/lib/backend/go-frame"
 */
import {initToken, rmStoreUserInfo, setBackend, storeUserInfo, updateStoreUserInfo} from "../../store"
import {RequestConfig} from "../../request"
import {RouteInterceptorConfig} from "../../router/intercepter"

import {
  getUserInfo,
  postUserAdminList,
  postUserLogin,
  postUserLogout,
  postUserUpdatePwd,
} from "./api-user"
import {
  FileLink,
  FileLinkPrivate,
  getCommonDownload,
  getCommonDownloadPrivate,
  postCommonFileDel,
  postCommonFileList,
  postCommonUpload,
} from "./api-common"
import {parsePage} from "./page"
import {checkPrivilege, matchPrivilege, userHasPrivilege} from "./principal"
import {payloadCryptoActive, payloadCryptoDisable, payloadCryptoEnable} from "./payload-crypto"

// —— 会话校验（原 lib/router/intercepter.js 默认实现，随 api 一起归属适配器） ——

async function checkUserLogin() {
  if (!storeUserInfo.token) {
    initToken()
  }
  if (!storeUserInfo.token) return
  // 校验登录用户
  let data = await getUserInfo(false)
  if (data) {
    updateStoreUserInfo(data)
  } else {
    rmStoreUserInfo()
  }
}

// —— 适配器对象 ——

export const goFrameBackend = {
  name: "go-frame",
  install() {
    setBackend(goFrameBackend)
    // 响应信封协议键（与核心层默认值一致，显式写出便于对照/按后端覆写）
    RequestConfig.defaultCodeSuccess = 0
    RequestConfig.defaultCodeAuthFail = 401
    RequestConfig.defaultKeyCode = "result"
    RequestConfig.defaultKeyMsg = "message"
    RequestConfig.defaultKeyData = "data"
    // 路由登录校验注入
    RouteInterceptorConfig.checkUserLogin = checkUserLogin
  },
  user: {
    getUserInfo,
    login: postUserLogin,
    logout: postUserLogout,
    updatePwd: postUserUpdatePwd,
    adminList: postUserAdminList,
  },
  file: {
    upload: postCommonUpload,
    list: postCommonFileList,
    del: postCommonFileDel,
    download: getCommonDownload,
    downloadPrivate: getCommonDownloadPrivate,
    link: FileLink,
    linkPrivate: FileLinkPrivate,
  },
  page: {
    parse: parsePage,
  },
  crypto: {
    enable: payloadCryptoEnable,
    disable: payloadCryptoDisable,
    active: payloadCryptoActive,
  },
}

// —— 公共 API re-export：业务代码统一从 "/lib/backend/go-frame" 引用 ——

export {
  // 用户/会话
  getUserInfo,
  postUserLogin,
  postUserLogout,
  postUserUpdatePwd,
  postUserAdminList,
  // 文件
  postCommonUpload,
  postCommonFileList,
  postCommonFileDel,
  getCommonDownload,
  getCommonDownloadPrivate,
  FileLink,
  FileLinkPrivate,
  // 分页适配（RestRet {data,total} → kit-pagination-page 约定）
  parsePage,
  // 权限判定（tokenkit.Principal 前端镜像，meta.authFunc 用）
  checkPrivilege,
  matchPrivilege,
  userHasPrivilege,
  // 报文加密
  payloadCryptoEnable,
  payloadCryptoDisable,
  payloadCryptoActive,
}
