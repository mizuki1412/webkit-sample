import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "./web-frame/plugin/vite-helper";
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "./web-frame/plugin/vite-add-icon";
import {viteAddVant} from "./web-frame/plugin/vite-add-vant";
import {viteAddAntD} from "./web-frame/plugin/vite-add-antd.js";

let plugins =  [
  vue(),
  tailwindcss(),
]
viteAddIcon(plugins)
viteAddAntD(plugins)
viteAddVant(plugins)

export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  server:{
    host: '0.0.0.0',
    proxy: {
      // 与 go-frame 对齐：rest.port 默认 10000，rest.base 默认空。
      // 后端若配置了 rest.base（如 /server），用 VITE_PROXY_TARGET 覆盖目标即可：
      //   VITE_PROXY_TARGET=http://127.0.0.1:10000/server
      "/api": {
        target: getEnv('VITE_PROXY_TARGET') || "http://127.0.0.1:10000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: plugins,
})
