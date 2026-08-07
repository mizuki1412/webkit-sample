import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "./lib/plugin/vite-helper";
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "./lib/plugin/vite-add-icon";
import {viteAddVant} from "./lib/plugin/vite-add-vant";
import {viteAddAntD} from "./lib/plugin/vite-add-antd.js";

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
      "/api": {
        target: "http://127.0.0.1:10000/server",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: plugins,
})
