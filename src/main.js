import {createApp} from "vue"
import App from "./App.vue"
import {setupWebkit} from "/lib"
import {goFrameBackend} from "/lib/backend/go-frame"
import {routes} from "./router"

// antdv reset 与 tailwind 由 /lib 装配入口引入。
// 引入其他框架的css，如果自动引入可能被tailwind覆盖。
import "vant/lib/index.css"
// tailwind中覆盖用的css
import "./after.css"

const app = createApp(App)
setupWebkit(app, {
  env: import.meta.env,
  backend: goFrameBackend,
  routes,
})

// antdv 组件由 unplugin-vue-components（AntdvNextResolver）按需自动引入；
// form-create 只在 /fc/* demo 页局部引入（见 src/views/form-create/*），
// 避免整库进首屏主包。

app.config.productionTip = false
app.mount("#app")
