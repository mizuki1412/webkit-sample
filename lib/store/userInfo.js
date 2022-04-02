import { reactive } from "vue"
import { configKit } from "./configkit"

export const storeUserInfo = reactive({
  user: undefined,
  token: undefined,
  redirect: undefined,
  expire: undefined,
  setting: undefined,
})

// export function initStoreUserInfo() {
//   const dataJson = localStorage.getItem(configKit.VITE_APP_NAME + '-user');
//   if (!dataJson) {
//     storeUserInfo.user = undefined;
//     storeUserInfo.token = undefined;
//     storeUserInfo.setting = undefined;
//   } else {
//     const data = JSON.parse(dataJson);
//     // 过期策略
//     if (new Date().getTime() - data.expire > 0) {
//       rmStoreUserInfo();
//     } else {
//       storeUserInfo.user = data.user;
//       storeUserInfo.token = data.token;
//       storeUserInfo.setting = data.setting;
//     }
//   }
// }

export function updateStoreUserInfo(data) {
  storeUserInfo.user = data.user
  storeUserInfo.token = data.token
  storeUserInfo.setting = data.setting
  // storeUserInfo.expire = new Date().getTime() + 1000 * 60 * 60 * 20;
  // const obj = {
  //   user: data.user,
  //   token: data.token,
  //   expire: storeUserInfo.expire,
  // };
  // localStorage.setItem(configKit.VITE_APP_NAME + '-user', JSON.stringify(obj));
}

export function rmStoreUserInfo() {
  for (const key in storeUserInfo) {
    delete storeUserInfo[key]
  }
  // localStorage.removeItem(configKit.VITE_APP_NAME + '-user');
}
