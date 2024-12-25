<template>
  <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      class="sidebar"
      mode="inline"
      :items="items"
      @click="handleClick"
  />
</template>

<script>
import { h, ref, watchEffect } from 'vue';
import {
  AppstoreOutlined,
  UserOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue';
import {useRouter, useRoute} from 'vue-router';

export default {
  setup(){
    const selectedKeys = ref(['DashBoard']);
    const openKeys = ref(['sub1']);
    const router = useRouter();
    const route = useRoute(); // 获取当前路由信息
    const items = ref([
      {
        key: 'DashBoard',
        icon: () => h(PieChartOutlined),
        label: '仪表盘',
      },
      {
        key: 'UserManage',
        icon: () => h(UserOutlined),
        label: '用户管理',
      },
      {
        key: 'PostManage',
        icon: () => h(AppstoreOutlined),
        label: '文章管理',
        title: '文章管理',
        children: [
          {
            key: 'ReportManage',
            label: '举报管理',
            title: '举报管理',
          },
          {
            key: 'LabelManage',
            label: '标签管理',
            title: '标签管理',
          },
        ],
      },
    ]);

    const toDashBoard = () => {
      router.push('/admin');
    };
    const toUserManage = () => {
      router.push('/userManage');
    };
    const toReportManage = () => {
      console.log('route')
      router.push('/reportManage');
    };
    const toLabelManage = () => {
      router.push('/labelManage');
    };

    // 根据路由更新选中项
    watchEffect(() => {
      const pathMap = {
        '/admin': 'DashBoard',
        '/userManage': 'UserManage',
        '/reportManage': 'ReportManage',
        '/labelManage': 'LabelManage',
      };
      selectedKeys.value = [pathMap[route.path] || 'DashBoard'];
    });

    const handleClick = (event) => {
      console.log('click', event);
      selectedKeys.value = [event.key];
      if(event.key === "UserManage"){
        toUserManage();
      }
      if(event.key === "DashBoard"){
        toDashBoard();
      }
      if(event.key === "ReportManage"){
        toReportManage();
      }
      if(event.key === "LabelManage"){
        toLabelManage();
      }
    };

    return {
      selectedKeys,
      openKeys,
      items,
      handleClick,
    }
  },
  name: "AdminSideBar"
}
</script>

<style scoped>
.sidebar {
  width: 256px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: calc(100vh - 64px); /* 减去 Header 的高度 */
  overflow: auto;
}
</style>