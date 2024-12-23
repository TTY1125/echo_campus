<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>
      <a-layout-content>
        <main class="main-content">
            <a-menu
                v-model:openKeys="openKeys"
                v-model:selectedKeys="selectedKeys"
                class="sidebar"
                mode="inline"
                :items="items"
                @click="handleClick"
            />
        </main>
      </a-layout-content>
  </a-layout>
</template>

<script>
import { h, ref } from 'vue';
import {
  AppstoreOutlined,
  UserOutlined,
  PieChartOutlined,
} from '@ant-design/icons-vue';
import {useRouter} from 'vue-router';
import IndexHeader from "@/components/index/header/IndexHeader.vue";

export default {
  components: {
    IndexHeader
  },
  setup(){
    const selectedKeys = ref(['DashBoard']);
    const openKeys = ref(['sub1']);
    const router = useRouter();
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
    const handleClick = (event) => {
      console.log('click', event);
      if(event.key === "UserManage"){
        toUserManage();
      }
      if(event.key === "DashBoard"){
        toDashBoard();
      }
      if(event.key === "ReportManage"){
        toReportManage();
      }
    };

    return {
      selectedKeys,
      openKeys,
      items,
      handleClick,
      IndexHeader,
    };
  },
  name: "AdminIndex"
}
</script>

<style scoped>
.header {
  flex-shrink: 0; /* 固定高度 */
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* 左侧侧边栏 */
.sidebar {
  width: 256px;
  flex-shrink: 0; /* 固定宽度 */
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: calc(100vh - 64px); /* 减去 Header 的高度 */
  overflow: auto;
}

</style>