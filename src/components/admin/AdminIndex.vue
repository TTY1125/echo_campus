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
  SettingOutlined,
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
        key: 'sub1',
        icon: () => h(AppstoreOutlined),
        label: 'Navigation Three',
        title: 'Navigation Three',
        children: [
          {
            key: '3',
            label: 'Option 3',
            title: 'Option 3',
          },
          {
            key: '4',
            label: 'Option 4',
            title: 'Option 4',
          },
          {
            key: 'sub1-2',
            label: 'Submenu',
            title: 'Submenu',
            children: [
              {
                key: '5',
                label: 'Option 5',
                title: 'Option 5',
              },
              {
                key: '6',
                label: 'Option 6',
                title: 'Option 6',
              },
            ],
          },
        ],
      },
      {
        key: 'sub2',
        icon: () => h(SettingOutlined),
        label: 'Navigation Four',
        title: 'Navigation Four',
        children: [
          {
            key: '7',
            label: 'Option 7',
            title: 'Option 7',
          },
          {
            key: '8',
            label: 'Option 8',
            title: 'Option 8',
          },
          {
            key: '9',
            label: 'Option 9',
            title: 'Option 9',
          },
          {
            key: '10',
            label: 'Option 10',
            title: 'Option 10',
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
    const handleClick = (event) => {
      console.log('click', event);
      if(event.key === "UserManage"){
        toUserManage();
      }
      if(event.key === "DashBoard"){
        toDashBoard();
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