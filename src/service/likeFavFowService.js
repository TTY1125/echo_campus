import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

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
            axiosInstance.post('/follow',data)
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
    getFollowerList(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/follow/list/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看自己的关注数
    getFollowNum(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/follow/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看自己的关注列表
    getFollowList(id,offset) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/follow/followed/list?id=${id}&offset=${offset}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 查看自己是否关注这个人
    getIfMyFollow(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`/follow/followed/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

    // 收藏
    favourite(data) {
        return new Promise((resolve, reject) => {
            axiosInstance.post('/favourite',data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 取消收藏
    notFavourite(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`/favourite/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

    // 查看自己的收藏列表
    getFavouriteList(id) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/favourite/users/${id}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

}