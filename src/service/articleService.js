import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

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
    // 获取未被举报成功的首页10篇文章,num是起始index
    getUnreportedArticles(num) {
        return new Promise((resolve, reject) => {
            axiosInstance.get("/posts/unReportedPosts/"+num)
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
    // 搜索
    searchPost(keyWord,offset) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/posts/search?keyword=${keyWord}&offset=${offset}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 获取热门帖子
    getHotPost() {
        return new Promise((resolve, reject) => {
            axiosInstance.get('/posts/hot')
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
}