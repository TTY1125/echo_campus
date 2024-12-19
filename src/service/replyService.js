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
    // 通过comment和post_id查询100条回复
    getReplies(num,comment,post_id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/replies?post=${post_id}&comment=${comment}&num=${num}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 发表回复
    addReply(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/replies",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 删除回复
    deleteReply(postId,replyId) {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`/replies?post=${postId}&id=${replyId}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

}