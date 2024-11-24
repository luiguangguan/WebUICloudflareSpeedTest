import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

// 使用 Element Plus
app.use(ElementPlus);

// 挂载应用
app.mount('#app');
