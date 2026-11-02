// vitest setup：configKitInit 放在 vitest.config.js 的 define 里会因
// 模块求值顺序不可靠，这里显式执行一次（与浏览器端 webkit.js 对齐）。
import {configKitInit} from "/lib/store/configkit"

configKitInit({
  VITE_APP_NAME: "test",
  VITE_REQUEST_BASE_URL: "/api",
  VITE_ROUTE_MODE: "hash",
  VITE_ROUTE_BASE_URL: "/",
  VITE_ASSETS_BASE_URL: "/",
  VITE_TITLE: "test",
})
