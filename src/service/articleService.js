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
    // 上传自己写的文章
    uploadArticle(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/posts",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 获取首页10篇文章,num是起始index
    getArticles(num) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/posts/"+num)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id查询文章
    getArticleById(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/posts/"+id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 发送帖子图片
    submitPostPic(file) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/upload/post",file)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 删除帖子图片
    deletePostPic(url) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/delete/post",url)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 获取帖子的评论加回复总量
    getPostAllCmtRep(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/posts/commentandreply/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 根据用户id获取用户的所有帖子
    getPostOfUser(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/posts/usergetall/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查询帖子的封面图片
    getPostPic(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/posts/picture/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
}