import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "web-frame/plugin/vite-helper";
import tailwindcss from '@tailwindcss/vite'
import {viteAddIcon} from "web-frame/plugin/vite-add-icon";
import {viteAddVant} from "web-frame/plugin/vite-add-vant";
import {viteAddAntD} from "web-frame/plugin/vite-add-antd.js";

// web-frame 是同级独立仓库（package.json 以 file:../web-frame 软链引入）。
// 【关键】必须 alias 到真实路径：若让裸包名走 node_modules 解析，vite 会把它
// 当普通依赖做 optimizeDeps 预打包——esbuild 打不编译 .vue 组件，导致同一包内
// 双模块实例（预打包闭包里的 store 与 .vue 源码管道读到的 store 不是同一个），
// 运行时报 storeCurrentRoute.meta undefined。alias 优先于预打包，框架整体进
// 源码管道：单实例、HMR 生效、其 CJS 依赖（dayjs/qs/nprogress）由预打包正常互操作。
const webFrameDir = fileURLToPath(new URL('../web-frame', import.meta.url))

let plugins =  [
  vue(),
  tailwindcss(),
]
viteAddIcon(plugins)
viteAddAntD(plugins)
viteAddVant(plugins)

export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  resolve: {
    alias: {
      "web-frame": webFrameDir,
    },
  },
  // 【关键】alias 后框架文件在项目根外（D:/codes/web/web-frame），其 bare import
  // 从真实路径向上解析会先撞上框架仓库自己的 node_modules——有状态依赖（vue 等）
  // 若在那里解析会与宿主分裂成双实例。include 把框架的运行时依赖预打包成 chunk，
  // aliased 源码模块的 bare import 统一重写到这些 chunk：单实例 + CJS（dayjs 等）
  // 互操作正常，且不要求框架仓库安装全部宿主依赖。
  optimizeDeps: {
    include: [
      "vue", "vue-router", "antdv-next", "@antdv-next/icons", "@vueuse/core",
      "axios", "qs", "dayjs", "nprogress",
      "echarts/core", "echarts/charts", "echarts/components", "echarts/renderers",
      "vue-echarts",
    ],
  },
  server:{
    host: '0.0.0.0',
    // alias 后框架文件在项目根外，dev server 需放行同级目录
    fs: {
      allow: ['..'],
    },
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
