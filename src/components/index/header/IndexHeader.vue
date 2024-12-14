<template>
  <a-layout>
    <a-layout id="components-layout-basic">

      <a-layout-header style="background:#ffffff;padding: 0">
        <div class="main-header">
          <a-col span=20 offset=2 >
            <a-flex justify="space-between">
              <a-flex class="header-left-content"><!-- 左侧内容 -->
                <a-flex align="center">
                  <img src="@/assets/img/logo1.png" alt="logo_img" @click="refresh1" style="height: 40px; caret-color: transparent;"/>
                </a-flex>
                <a-menu v-model:selectedKeys="current"
                        mode="horizontal"
                        :items="items"
                        @click="handleClick"/>
                <!-- 搜索框 -->
                <div class="header-search" style="margin-left: 12px">
                  <a-input-search v-model:value="searchContentTemp" placeholder="搜索"
                                  style="min-width: 100px; width: 100%"
                                  @search="onSearch"
                  />
                </div>
              </a-flex>

              <div class="header-right-content" ><!-- 右侧内容 -->

                <div class="header-item">
                  <span style="padding: 0 10px">写文章</span>
                </div>

                <div class="header-item">
                  <span style="padding: 0 20px">管理端</span>
                </div>

                <div class="header-item">
                  <IndexLogin v-if="!$store.state.isLogin"/>
                </div>

                <div class="header-item">
                  <a-button type="primary" @click="showToken">token</a-button>
                </div>

              </div>
            </a-flex>
          </a-col>

        </div>
      </a-layout-header>
    </a-layout>
  </a-layout>
</template>


<script>
import {getCurrentInstance, h, ref} from 'vue';
import { HomeOutlined, AppstoreOutlined, TagOutlined , InfoCircleOutlined,BookOutlined} from '@ant-design/icons-vue';
import IndexLogin from "@/components/index/header/IndexLogin.vue";
import {useStore} from "vuex";

export default {
  name: 'IndexHeader',
  components: {IndexLogin},
  setup(){
    const current = ref(['index']);
    const items = ref([
      {
        key: 'index',
        icon: () => h(HomeOutlined),
        label: '首页',
      },
      {
        key: 'subject',
        icon: () => h(AppstoreOutlined),
        label: '话题',
      },
      {
        key: 'tags',
        icon: () => h(TagOutlined),
        label: '标签',
      },
      // {
      //   key: 'auth',
      //   icon: () => h(PayCircleOutlined),
      //   label: '授权',
      // },
      {
        key: 'about',
        icon: () => h(InfoCircleOutlined),
        label: '关于',
      },
      {
        key: 'learn',
        icon: () => h(BookOutlined),
        label: '学习',
      },
    ]);
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const showToken = ()=>{
      proxy.$message.info(store.state.token,0.5)
    }
    return{
      current,
      items,
      showToken,
    }
  },

  methods: {
    refresh1(){
      this.$router.push('/');
    },
    handleClick(event){
      console.log('click', event);
    },
  }
}
</script>

<style lang="less" scoped>
.main-header {
  width: 100%;
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.header-left-content-content {
  //padding-right: 16px;
  display: flex;
  justify-content: space-between;
}

.header-right-content {
  //padding-right: 16px;
  display: flex;
  justify-content: space-between;
}

.header-search {
  padding-right: 16px;
  display: flex;
  align-self: center;
}

.header-item {
  //margin:0 16px;
  white-space: nowrap;
}

/* -------- inline-end -------- */
:deep( .ant-menu-horizontal > .ant-menu-item::after),
:deep( .ant-menu-horizontal > .ant-menu-submenu::after){
  //border-bottom: 2px solid transparent!important;
  //border:0!important;
}

:deep( .ant-menu-horizontal > .ant-menu-item::after),
:deep( .ant-menu-horizontal > .ant-menu-submenu::after){
  //border-bottom: 2px solid transparent!important;
  border:0!important;
}

// 去掉选中后的插入符
:deep( .ant-menu-item:focus ){
  caret-color: transparent;
}

:deep( .ant-menu-item:hover ){
  background-color: #f0f2f5;
}

// 去掉底边的描边
.ant-menu-horizontal {
  border:0!important;
}

</style>
