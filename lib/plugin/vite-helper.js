// help for vite.config.js

import _ from "lodash";
import {loadEnv} from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import styleImport from "vite-plugin-style-import";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

const envResolve = (mode) => {
  return loadEnv(mode, process.cwd());
};

// 获取env变量，todo 只能获取VITE_?
export const getEnv = function (env) {
  return envResolve(_.last(process.argv))[env];
}

export function pluginAdd(plugins,id,config){
  switch (id){
    case "icon":
      if(!config) config = 'src/assets/icons'
      plugins.push(createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), config)],
      }))
      break
    case "element":
      // 自动按需导入：原理是直接在源文件中加入了import语句
      plugins.push(Components({
        resolvers: [ElementPlusResolver()],
      }))
      plugins.push(AutoImport({
        // todo loading-direactive有bug https://github.com/element-plus/element-plus/issues/4855
        resolvers: [ElementPlusResolver({ importStyle: false })],
      }))
      break
    case "vant":
      plugins.push(styleImport({
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: (name) => `vant/es/${name}/style/index`,
          },
        ],
      }))
      break
    default:
      throw new Error("不支持的plugin id")
  }
}
