import {reactive} from "vue";

/**
 * webkit需要的环境配置项，允许从import.meta.env中加载.
 */

export const configKit = reactive({
  VITE_APP_NAME: undefined,
  VITE_REQUEST_BASE_URL: undefined,  // request中使用的base url
  VITE_ICON_FONT_URL: undefined,  // todo
  VITE_ROUTE_MODE :undefined,  // router
  BASE_URL: undefined  // router中的base url
});

export function configKitInit(env){
  configKit.VITE_APP_NAME = env.VITE_APP_NAME
  configKit.VITE_REQUEST_BASE_URL = env.VITE_REQUEST_BASE_URL
  configKit.VITE_ICON_FONT_URL = env.VITE_ICON_FONT_URL
  configKit.VITE_ROUTE_MODE = env.VITE_ROUTE_MODE
  configKit.BASE_URL = env.BASE_URL
}
