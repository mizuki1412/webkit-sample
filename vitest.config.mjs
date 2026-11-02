import {fileURLToPath} from "node:url"
import vue from "@vitejs/plugin-vue"

// vitest 复用 vite 插件链；unplugin-vue-components 的 antdv resolver 对
// 单测（目前只覆盖纯函数）不必要，未接入以保持测试启动轻量。
// 注意：config 文件自身不能用 /lib 绝对路径 import（别名此时尚未生效），
// 初始化放在 vitest.setup.js 中完成。
const fakeEnv = {
  VITE_APP_NAME: "test",
  VITE_REQUEST_BASE_URL: "/api",
  VITE_ROUTE_MODE: "hash",
  VITE_ROUTE_BASE_URL: "/",
  VITE_ASSETS_BASE_URL: "/",
  VITE_TITLE: "test",
}

export default {
  plugins: [vue()],
  resolve: {
    alias: {
      // 与 src 内的裸绝对路径 import（如 /lib/request）对齐
      "/lib": fileURLToPath(new URL("./lib", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["lib/**/*.test.js", "src/**/*.test.js"],
    setupFiles: ["./vitest.setup.js"],
  },
  define: {
    "import.meta.env": fakeEnv,
  },
}
