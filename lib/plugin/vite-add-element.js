import AutoImport from "unplugin-auto-import/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

export function viteAddElement(plugins, config){
    plugins.push(
        AutoImport({
            resolvers: [
                ElementPlusResolver({importStyle: false, ...config}),
            ],
        })
    )
    plugins.push(
        Components({
            resolvers: [
                ElementPlusResolver({importStyle: false, ...config}),
            ],
        })
    )
}