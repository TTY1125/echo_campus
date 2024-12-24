import axios from "axios";

// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

axiosInstance.defaults.withCredentials = true;

// 设置请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // 每次请求时重新获取 token
        if (token) {
            config.headers['Authorization'] = `${token}`; // 将 token 添加到请求头
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default axiosInstance;