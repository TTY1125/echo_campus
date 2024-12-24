import axios from "axios"
import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

const axiosInstance1 = axios.create({ //axiosInstance带token,axiosInstance1不带
    baseURL: process.env.VUE_APP_API_BASE_URL
});

export default {
    // 注册
    register(data) {
        return new Promise((resolve, reject) => {
            axiosInstance1.post("/users/register", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 登录
    login(data) {
        return new Promise((resolve, reject) => {
            axiosInstance1.post("/users/login", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 退出登录
    logout() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/users/logout")
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}