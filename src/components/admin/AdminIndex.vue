<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>
      <a-layout-content>
        <main class="main-content">
            <AdminSideBar/>

          <WebSocketExample/>
        </main>

      </a-layout-content>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import AdminSideBar from "@/components/admin/AdminSideBar";
import WebSocketExample from "@/components/message/messageDefine.vue"

export default {
  components: {
    IndexHeader,
    AdminSideBar,
    WebSocketExample
  },
  setup(){
    return {
      IndexHeader,
      AdminSideBar,
      WebSocketExample,
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