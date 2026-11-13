import {createApp} from "vue"
import App from "./App.vue"
import {defaultComponents, setupWebkit} from "/web-frame"
import KitModal from "/web-frame/components/kit-modal"
import KitPaginationPage from "/web-frame/components/kit-pagination-page"
import {goFrameBackend} from "/web-frame/backend/go-frame"
import {routes} from "./router"

// antdv reset 与 tailwind 由 /web-frame 装配入口引入。
// 引入其他框架的css，如果自动引入可能被tailwind覆盖。
import "vant/lib/index.css"
// tailwind中覆盖用的css
import "./after.css"
// 设计语言（原图→tokens→build.py 产物）：变量定义在前，适配层在后
import "../design/themes/build/all-themes.css"
import "./design/adapter.css"

const app = createApp(App)
setupWebkit(app, {
  env: import.meta.env,
  backend: goFrameBackend,
  routes,
  // web-frame 新版 defaultComponents 仅保留 KitIcon，KitModal/KitPaginationPage 改按需传入
  components: [...defaultComponents, KitModal, KitPaginationPage],
})

// antdv 组件由 unplugin-vue-components（AntdvNextResolver）按需自动引入。

app.config.productionTip = false
app.mount("#app")
