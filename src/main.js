import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import Antd,{ message } from 'ant-design-vue';
import store from './store';
import 'ant-design-vue/dist/reset.css'; // 引入样式
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 引入echarts
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'

const app = createApp(App)
app.config.globalProperties.$message = message;

// 使用组件 echarts
app.component('e-charts',Echarts)
// 全局挂载 echarts
app.config.globalProperties.$echarts = echarts

app
    .use(router)
    .use(Antd)
    .use(store)
    .use(mavonEditor)
    .mount('#app')

