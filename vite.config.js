import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv} from "./lib/plugin/vite-helper";
import {viteAddIcon} from "./lib/plugin/vite-add-icon";
import {viteAddElement} from "./lib/plugin/vite-add-element";
import {viteAddVant} from "./lib/plugin/vite-add-vant";
import {viteAddArco} from "./lib/plugin/vite-add-arco";

let plugins =  [
  vue(),
]
viteAddIcon(plugins)
viteAddElement(plugins)
viteAddVant(plugins)
viteAddArco(plugins)

// https://vitejs.dev/config/
export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  server:{
    host: '0.0.0.0'
  },
  plugins: plugins,
})
