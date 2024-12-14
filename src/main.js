import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Antd,{ message } from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/reset.css'; // 引入样式

const app = createApp(App)
app.config.globalProperties.$message = message;

app
    .use(router)
    .use(Antd)
    .use(store)
    .mount('#app')

