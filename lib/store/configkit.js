import {reactive} from "vue";
import {setAxiosDefaultBaseUrl} from "../request";

/**
 * webkit需要的环境配置项，允许从import.meta.env中加载.
 */

export const configKit = reactive({
  VITE_APP_NAME: undefined,
  VITE_REQUEST_BASE_URL: undefined,  // request中使用的base url
  VITE_ICON_FONT_URL: undefined,  // todo
  VITE_ROUTE_MODE :undefined,  // router
  VITE_BASE_URL: undefined,  // router中的base url
  TITLE: undefined, // 用于web页面的title
  TITLE_SIMPLE: undefined,
  TITLE_APP: undefined, // 用于app页面的title，如果不存在将替换为TITLE
});

export function configKitInit(env){
  configKit.VITE_APP_NAME = env.VITE_APP_NAME
  configKit.VITE_REQUEST_BASE_URL = env.VITE_REQUEST_BASE_URL
  configKit.VITE_ICON_FONT_URL = env.VITE_ICON_FONT_URL
  configKit.VITE_ROUTE_MODE = env.VITE_ROUTE_MODE
  configKit.VITE_BASE_URL = env.VITE_BASE_URL
  configKit.TITLE = env.VITE_TITLE
  configKit.TITLE_SIMPLE = env.VITE_TITLE_SIMPLE
  configKit.TITLE_APP = env.VITE_TITLE_APP
  if (!configKit.TITLE_APP || configKit.TITLE_APP===""){
    configKit.TITLE_APP = configKit.TITLE
  }
  // request set
  setAxiosDefaultBaseUrl()
}
