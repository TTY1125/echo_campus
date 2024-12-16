import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

// 假设 token 已经获取并存储在 localStorage 中
const token = localStorage.getItem('token'); // 从 localStorage 获取 token

export default {
    // 注册
    register(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/users/register", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 登录
    login(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/users/login", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 退出登录
    logout() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/users/logout", {
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}