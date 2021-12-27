import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import {useWebkit} from "./plugins/webkit";

// todo
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)
useWebkit(app)

app.config.productionTip = false;
app.mount('#app')
