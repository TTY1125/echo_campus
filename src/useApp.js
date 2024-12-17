import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getCurrentInstance } from 'vue';

export function useApp() {
    const router = useRouter();  // 获取路由对象
    const route = useRoute();    // 获取当前路由信息
    const store = useStore();    // 获取 Vuex store
    const { proxy } = getCurrentInstance();  // 获取组件实例的 proxy（包含全局属性）

    return {
        router,
        route,
        store,
        proxy,
    };
}