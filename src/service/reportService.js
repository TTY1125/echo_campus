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
    // 获取所有举报信息
    getAllReportsInfo() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/report/all")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过post_id获取某文章的第一条举报信息
    getFirstReportInfo(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/report/" + id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id修改其他举报信息
    editOtherPostInfo(id, data) {
        return new Promise((resolve, reject) => {
            axiosInstance.put("/report/" + id, data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    addUserInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/report/addReport", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id修改举报信息
    deleteReports(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/report/deleteReports", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    notifyUser(id){
        return new Promise((resolve, reject) => {
            axiosInstance.get("/report/notifyUser/" + id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    }
}