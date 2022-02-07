import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import {useWebkit} from "./plugins/webkit";
// import 'element-plus/theme-chalk/index.css'

const app = createApp(App)
useWebkit(app)

// todo element 自动导入icon
import { Search} from '@element-plus/icons-vue'
app.component("Search",Search)

app.config.productionTip = false;
app.mount('#app')
