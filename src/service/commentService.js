import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

export default {
    // 通过post_id查询100条评论
    getComments(num,post_id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/comments?post=${post_id}&num=${num}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 发表评论
    addComments(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post("/comments",data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 删除评论
    deleteComments(postId,commentId) {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`/comments?post=${postId}&id=${commentId}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

}