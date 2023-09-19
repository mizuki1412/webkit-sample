import AutoImport from "unplugin-auto-import/vite";
import {ArcoResolver} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import {vitePluginForArco} from "@arco-plugins/vite-vue";

export function viteAddArco(plugins, config){
    // plugins.push(
    //     AutoImport({
    //         resolvers: [ArcoResolver()],
    //     })
    // )
    // plugins.push(
    //     Components({
    //         resolvers: [
    //             ArcoResolver({
    //                 sideEffect: true
    //             })
    //         ],
    //     })
    // )
    plugins.push(
        vitePluginForArco({
            style: 'css'
        })
    )
}