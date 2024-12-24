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
};