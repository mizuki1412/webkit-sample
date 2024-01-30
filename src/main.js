import {createApp} from "vue"
import App from "./App.vue"
import {useWebkit} from "./plugins/webkit"

const app = createApp(App)
useWebkit(app)

app.config.productionTip = false
app.mount("#app")
