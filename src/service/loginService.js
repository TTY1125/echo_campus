import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

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
    logout(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/api/bbs/sso/logout", data)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}