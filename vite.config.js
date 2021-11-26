import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteSvgIcons from 'vite-plugin-svg-icons';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    // svg 雪碧图生成，并用svgo压缩
    viteSvgIcons({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    }),
    // 自动按需导入：原理是直接在源文件中加入了import语句
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
