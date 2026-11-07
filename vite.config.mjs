import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "web-frame/plugin/vite-helper";
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "web-frame/plugin/vite-add-icon";
import {viteAddVant} from "web-frame/plugin/vite-add-vant";
import {viteAddAntD} from "web-frame/plugin/vite-add-antd.js";

let plugins =  [
  vue(),
  tailwindcss(),
]
viteAddIcon(plugins)
viteAddAntD(plugins)
viteAddVant(plugins)

export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  // web-frame 是 file:../web-frame 软链依赖（真实文件在项目根外）。
  // preserveSymlinks 使框架模块按 node_modules/web-frame/... 参与解析：
  // 其 bare import（nprogress/antdv-next 等）回退到宿主 node_modules 可达，
  // dev server 也无需额外 fs.allow（模块路径在项目根内）。
  resolve: {
    preserveSymlinks: true,
  },
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
