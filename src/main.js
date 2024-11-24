import { createApp } from 'vue'
import router from './router';
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import store from './store';
import request from './uitils/request';
import storage from './uitils/storage';
import config from './config';
import api from './api';

console.log("环境变量", import.meta.env);
const app = createApp(App);
console.log(config.mockApi);
console.log(config.env);
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
// app.config.globalProperties.$store = store这样挂载也是可行的但是不推荐
app.use(router).use(store).use(ElementPlus).mount('#app');
// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
