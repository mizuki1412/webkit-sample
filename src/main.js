import { createApp } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import './index.css'
import {useWebkit} from "./plugins/webkit";

const app = createApp(App)
useWebkit(app)

app.config.productionTip = false;
app.mount('#app')
