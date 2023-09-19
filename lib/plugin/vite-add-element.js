import AutoImport from "unplugin-auto-import/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import _ from "lodash";
import Components from "unplugin-vue-components/vite";


export function viteAddElement(plugins, config){
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
}