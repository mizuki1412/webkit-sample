import {reactive} from "vue"

/**
 * webkit需要的环境配置项，允许从import.meta.env中加载.
 *
 * 本文件只持有配置状态，不 import request——configKitInit 后由装配入口
 * （lib/index.js 的 setupWebkit）显式调 request 的 setAxiosDefaultBaseUrl()，
 * 避免 store ↔ request 循环引用。
 */

export const configKit = reactive({
  appName: undefined,
  requestBaseUrl: undefined, // request中使用的base url
  routeMode: undefined, // router
  routeBaseUrl: undefined, // router中的base url
  assetsBaseUrl: undefined, // assets中的base url
  title: undefined, // 用于web页面的title
  titleSimple: undefined,
  titleApp: undefined, // 用于app页面的title，如果不存在将替换为TITLE
  ossUrlPrefix: undefined, // oss url 地址的前缀
  tinymceApiKey: undefined, // 富文本编辑器tinymce api key
  schema: undefined, // 用于后端
})

export function configKitInit(env) {
  configKit.appName = env.VITE_APP_NAME
  configKit.requestBaseUrl = env.VITE_REQUEST_BASE_URL
  configKit.routeMode = env.VITE_ROUTE_MODE
  configKit.routeBaseUrl = env.VITE_ROUTE_BASE_URL
  configKit.assetsBaseUrl = env.VITE_ASSETS_BASE_URL
  configKit.title = env.VITE_TITLE
  configKit.titleSimple = env.VITE_TITLE_SIMPLE
  configKit.titleApp = env.VITE_TITLE_APP
  if (!configKit.titleApp || configKit.titleApp === "") {
    configKit.titleApp = configKit.title
  }
  configKit.ossUrlPrefix = env.VITE_OSS_PREFIX
  configKit.tinymceApiKey = env.VITE_WEB_TINYMCE_KEY
  configKit.schema = env.VITE_SCHEMA
}
