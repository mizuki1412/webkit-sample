import {createApp} from "vue"
import App from "./App.vue"
import {useWebkit} from "./plugins/webkit"

const app = createApp(App)
useWebkit(app)

// antdv 组件由 unplugin-vue-components（AntdvNextResolver）按需自动引入；
// form-create 只在 /fc/* demo 页局部引入（见 src/views/form-create/*），
// 避免整库进首屏主包。

app.config.productionTip = false
app.mount("#app")
