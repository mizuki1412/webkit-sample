import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "./lib/plugin/vite-helper";
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "./lib/plugin/vite-add-icon";
import {viteAddVant} from "./lib/plugin/vite-add-vant";
import {viteAddAntD} from "./lib/plugin/vite-add-antd.js";
import VueDevTools from 'vite-plugin-vue-devtools'

let plugins =  [
  vue(),
  tailwindcss(),
  // 启动有错误？？
  VueDevTools(),
]
viteAddIcon(plugins)
viteAddAntD(plugins)
viteAddVant(plugins)
// 对chrome69的兼容
// import legacy from '@vitejs/plugin-legacy'
// plugins.push(legacy({
//   targets: ['chrome >= 64'],
//   modernPolyfills: ['es/global-this'],
// }),)

// https://vitejs.dev/config/
export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  server:{
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://127.0.0.1:10000/server",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: plugins,
})
