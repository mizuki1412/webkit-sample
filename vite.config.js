import { defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {getEnv, pluginAdd} from "./lib/plugin/vite-helper";

let plugins =  [
  vue(),
]
pluginAdd(plugins, "icon")
pluginAdd(plugins, "element")
pluginAdd(plugins, "vant")

// https://vitejs.dev/config/
export default defineConfig({
  base: getEnv('VITE_ASSETS_BASE_URL'),
  server:{
    host: '0.0.0.0'
  },
  plugins: plugins,
})
