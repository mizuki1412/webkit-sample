import {VantResolver} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";

export function viteAddVant(plugins, config){
    // todo 已经在plugin/webkit中导入了所有的css
    // todo 4.0 https://vant-ui.github.io/vant/#/zh-CN/quickstart
    plugins.push(Components({
        resolvers: [VantResolver()],
    }))
}