import { VantResolver } from '@vant/auto-import-resolver';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

// todo 自动加载无效了 https://vant-ui.github.io/vant/#/zh-CN/quickstart
export function viteAddVant(plugins, config){
    // todo 已经在plugin/webkit中导入了所有的css
    plugins.push(AutoImport({
        resolvers: [VantResolver()],
    }))
    plugins.push(Components({
        resolvers: [VantResolver({
            importStyle: false,
        })],
    }))
}