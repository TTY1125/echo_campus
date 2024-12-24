import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

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