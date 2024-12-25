import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

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
    addUserInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/users/addUser", data)
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
    // 通过id修改其他用户的信息
    editOtherUserInfo(id, data) {
        return new Promise((resolve, reject) => {
            axiosInstance.put("/users/" + id, data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id删除其他用户的信息
    deleteOtherUserInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/users/deleteUsers", data)
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
    // 注销自己
    deleteUser() {
        return new Promise((resolve, reject) => {
            axiosInstance.delete("/users")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id获取所有用户信息
    getAllUsersInfo() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/users/all")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
}