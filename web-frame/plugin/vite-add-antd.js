import Components from 'unplugin-vue-components/vite';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';

export function viteAddAntD(plugins, config){
    plugins.push(
      Components({
        resolvers: [
          AntdvNextResolver({
            importStyle: false,
          }),
        ],
      })
    )
}