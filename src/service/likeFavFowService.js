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
    // 点赞
    like(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/like",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 取消点赞
    notLike(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post('/like/delete',data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看我自己有没有给这个东西点过赞
    getIfMyLike(post,comment,reply) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/like/exist?post=${post}&comment=${comment}&reply=${reply}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看这个东西的点赞量
    getLikeNum(post,comment,reply) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/like?post=${post}&comment=${comment}&reply=${reply}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 关注
    follow(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/follow",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 取消关注
    notFollow(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`/follow/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看粉丝数
    getFollowerNum(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/follow/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看粉丝列表
    getFollowList(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/follow/list/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

}