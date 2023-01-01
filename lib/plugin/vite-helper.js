// help for vite.config.js

import _ from "lodash"
import {loadEnv} from "vite"
import {createSvgIconsPlugin} from "vite-plugin-svg-icons"
import path from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import {ElementPlusResolver, VantResolver} from "unplugin-vue-components/resolvers"

const envResolve = (mode) => {
  return loadEnv(mode, process.cwd())
}

// 获取env变量，todo 只能获取VITE_?
export const getEnv = function (env) {
  return envResolve(_.last(process.argv))[env]
}

/**
 * id=icon: 需要配合KitIcon组件
 * @param plugins
 * @param id
 * @param config
 */
export function pluginAdd(plugins, id, config) {
  switch (id) {
    case "icon":
      if (!config) config = "src/assets/icons"
      plugins.push(
        createSvgIconsPlugin({
          iconDirs: [path.resolve(process.cwd(), config)],
        })
      )
      break
    case "element":
      // 自动按需导入：原理是直接在源文件中加入了import语句
      plugins.push(
        AutoImport({
          // todo 已经在plugin/webkit.js中导入了所有的css
          // resolvers: [ElementPlusResolver()],
          resolvers: [
            ElementPlusResolver(_.merge({importStyle: false}, config)),
          ],
        })
      )
      plugins.push(
        Components({
          resolvers: [
            ElementPlusResolver(_.merge({importStyle: false}, config)),
          ],
        })
      )
      break
    case "vant":
      // todo 已经在plugin/webkit中导入了所有的css
      // todo 4.0 https://vant-ui.github.io/vant/#/zh-CN/quickstart
      plugins.push(Components({
        resolvers: [VantResolver()],
      }))
      break
    default:
      throw new Error("不支持的plugin id")
  }
}
