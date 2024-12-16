import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL
});

// 假设 token 已经获取并存储在 localStorage 中
const token = localStorage.getItem('token'); // 从 localStorage 获取 token

// 设置 axios 全局默认配置
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers['Authorization'] = `${token}`;

export default {
    // 获取自己的用户信息
    getUserInfo() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/users")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id获取其他用户信息
    getOtherUserInfo(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/users/"+id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 修改自己的用户信息
    editUserInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.put("/users",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 修改自己的头像
    uploadAvatar(file, config = {}) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/upload/picture",file, config)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

}