import {reactive} from "vue"
import {configKit} from "./configkit";

export const storeUserInfo = reactive({
  user: undefined,
  token: undefined,
  redirect: undefined,
  // expire: undefined,
  // setting: undefined,
})

export function initToken() {
  const token = localStorage.getItem(configKit.appName + '-token');
  if (token) {
    storeUserInfo.token = token
  }
}

export function updateStoreUserInfo(data) {
  storeUserInfo.user = data.user
  storeUserInfo.token = data.token
  // storeUserInfo.expire = new Date().getTime() + 1000 * 60 * 60 * 20;
  localStorage.setItem(configKit.appName + '-token', storeUserInfo.token);
}

export function rmStoreUserInfo() {
  for (const key in storeUserInfo) {
    delete storeUserInfo[key]
  }
  localStorage.removeItem(configKit.appName + '-token');
}
