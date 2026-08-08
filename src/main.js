import {createApp} from "vue"
import App from "./App.vue"
import {useWebkit} from "./plugins/webkit"

const app = createApp(App)
useWebkit(app)

import antd from 'antdv-next';
app.use(antd)
import formCreate from '@form-create/antdv-next'
app.use(formCreate)


app.config.productionTip = false
app.mount("#app")