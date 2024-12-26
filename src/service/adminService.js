import axiosInstance from '@/axios/axiosConfig'; // 引入配置好的 axios 实例

export default {
    // 发帖统计
    statPost(timeRange) {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`/dashboard?timerange=${timeRange}`)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
}