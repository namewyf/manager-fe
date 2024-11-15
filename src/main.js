import { createApp } from 'vue'
import router from './router';
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
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
