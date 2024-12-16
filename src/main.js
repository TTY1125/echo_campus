import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Antd,{ message } from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/reset.css'; // 引入样式
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
app.config.globalProperties.$message = message;

app
    .use(router)
    .use(Antd)
    .use(store)
    .use(mavonEditor)
    .mount('#app')

