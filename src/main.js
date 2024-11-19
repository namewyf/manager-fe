import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import axios from 'axios';
import request from './uitils/request';
import storage from './uitils/storage';
import config from './config';

console.log("环境变量", import.meta.env);
const app = createApp(App);
console.log(config.mockApi);
console.log(config.env);
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus).mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
