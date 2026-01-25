import {createApp} from "vue"
import App from "./App.vue"
import {useWebkit} from "./plugins/webkit"

const app = createApp(App)
useWebkit(app)

// todo fc需要完整注册
import antd from 'ant-design-vue';
app.use(antd)
import FcDesigner from '@form-create/antd-designer'
app.use(FcDesigner)
app.use(FcDesigner.formCreate)


app.config.productionTip = false
app.mount("#app")
