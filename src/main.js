import { createApp } from 'vue'
import router from './router';
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

console.log("环境变量", import.meta.env);
const app = createApp(App);
app.use(router);
app.mount('#app');
app.use(ElementPlus)
