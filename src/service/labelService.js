import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

export default {
    // 获取标签
    getLabelList(num) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/label/getList"+num)
                .then(res => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取所有标签信息,num是起始index
    getAllLabelsInfo(num) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/label/all/" + num)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 获取所有标签信息,num是起始index
    getAllLabels() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/label/all")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id获取标签信息
    getOtherLabelInfo(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/label/"+id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 根据标签id获取标签对应的所有帖子
    getPostOfLabel(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/label/labelGetAll/` + id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 根据文章id获取文章对应的所有标签
    getLabelOfPost(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/label/postGetAll/` + id)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id删除其他标签的信息
    deleteOtherLabelInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/label/deleteLabels", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    addLabelInfo(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/label/addLabel", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 通过id修改其他用户的信息
    editOtherLabelInfo(id, data) {
        return new Promise((resolve, reject) => {
            axiosInstance.put("/label/" + id, data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
};