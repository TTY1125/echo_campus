<template>
  <a-layout>
    <a-layout id="header">

      <a-layout-header style="background:#ffffff;padding: 0">
        <div class="main-header">
          <a-col span=18 offset=3 >
            <a-flex justify="space-between">
              <a-flex class="header-left-content"><!-- 左侧内容 -->
                <a-flex align="center">
                  <img src="@/assets/img/logo1.png" alt="logo_img" @click="toIndex" style="cursor: pointer;height: 40px; caret-color: transparent;"/>
                </a-flex>
                <a-menu v-model:selectedKeys="currSelectedKeys"
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

              <a-flex class="header-right-content" style="align-content: center"><!-- 右侧内容 -->
                <div class="header-item">
                  <a-button type="text" @click="toWrite"><EditOutlined />写文章</a-button>
                </div>

                <div v-if ="isAdmin">
                  <div class="header-item">
                    <a-button type="text" @click="toAdmin"><BarChartOutlined />管理端</a-button>
                  </div>
                </div>

                <div class="header-item" v-if="!$store.state.isLogin">
                  <IndexLogin ref="indexLogin"/>
                </div>

                <div class="header-item">
                  <a-avatar v-if="$store.state.isLogin" :src="avatar" @click = "toUserHomePage" style="cursor: pointer;" >
                    <template #icon v-if="isAvatarNull">
                      <UserOutlined />
                    </template>
                  </a-avatar>
                </div>

                <!--
                <div class="header-item">
                  <a-button type="primary" @click="showToken">token</a-button>
                </div>
                -->

                <div class="header-item" v-if="$store.state.isLogin">
                  <a-button type="text" @click="logout"><LogoutOutlined />退出登录</a-button>
                </div>
              </a-flex>
            </a-flex>
          </a-col>

        </div>
      </a-layout-header>
    </a-layout>
  </a-layout>
</template>

<script>
import { h, ref } from 'vue';
import { HomeOutlined, TagOutlined , InfoCircleOutlined,
  UserOutlined, EditOutlined, BarChartOutlined, LogoutOutlined} from '@ant-design/icons-vue';
import IndexLogin from "@/components/index/header/IndexLogin.vue";
import { useApp } from "@/useApp";
import userInfoService from "@/service/userInfoService";
import loginService from "@/service/loginService";

export default {
  name: 'IndexHeader',
  components: {IndexLogin,UserOutlined,EditOutlined,BarChartOutlined,LogoutOutlined},
  setup(){
    const indexLogin = ref(null);
    const currSelectedKeys = ref(['index']);
    const { proxy, store, route, router } = useApp();
    const isAvatarNull = ref(true);
    const userid = ref(0);
    const avatar = ref(null);
    const searchContentTemp = ref('');
    const isAdmin = ref(false);
    const items = ref([
      {
        key: 'index',
        icon: () => h(HomeOutlined),
        label: '首页',
      },
      {
        key: 'label',
        icon: () => h(TagOutlined),
        label: '标签',
      },
      {
        key: 'about',
        icon: () => h(InfoCircleOutlined),
        label: '关于',
      },
    ]);
    const showToken = ()=>{
      proxy.$message.info(store.state.token,0.5)
    };
    const logout = ()=>{
      loginService.logout()
          .then(()=>{
            proxy.$message.success("退出登录成功");
            store.commit("logout");
          })
          .catch(()=>{
            proxy.$message.error("退出登录失败");
          })
    };
    const initUserInfo = () =>{
      if(store.state.isLogin){
        userInfoService.getUserInfo()
            .then(res=>{
              if(res.data.data.profile_picture !== undefined){
                isAvatarNull.value = false;
                avatar.value = res.data.data.profile_picture;
              }
              if(res.data.data.id){
                userid.value = res.data.data.id;
                if(store.getters.getId === -1){
                  console.log("获取用户: ",userid.value);
                  store.commit("setId",userid.value);
                }
                if(res.data.data.is_admin){
                  isAdmin.value = true;
                }
              }
            })
            .catch(err => {
              console.log("获取用户信息错误: ", err);
              proxy.$message.error("获取用户信息错误",err.desc);
            })
      }
    }

    const toIndex = () => {
      router.push('/');
    };
    const toTags = () => {
      router.push('/label');
    };
    const toAbout = () => {
      router.push('/about');
    };
    const toAdmin = () => {
      router.push('/admin');
    };

    const handleClick = (event) => {
      console.log('click', event);
      if(event.key === "index"){
        toIndex();
      }
      if(event.key === "label"){
        toTags();
      }
      if(event.key === "about"){
        toAbout();
      }
    };
    const toUserHomePage = () => {
      if(userid.value){
        router.push('/user/'+userid.value);
      }else{
        proxy.$message.error("无法获取userid")
        console.log('userid为空！');
      }
    };
    const toWrite = () => {
      if(!store.state.isLogin){
        if(indexLogin.value){
          indexLogin.value.showModal();
        }
      }else{
        router.push('/write');
      }
    };
    const getCurrSelectedKeys = ()=>{
      let currName = route.name;
      currSelectedKeys.value.pop();
      if (currName === 'index'){
        currSelectedKeys.value.push('index');
      }
      if (currName === 'label'){
        currSelectedKeys.value.push('label');
      }
      if (currName === 'about'){
        currSelectedKeys.value.push('about');
      }
    }

    const onSearch = () =>{
      router.push({path: "/search", query: {query: searchContentTemp.value}});
      if(route.name === 'search'){
        // 获取当前的 URL 和查询参数
        const url = new URL(window.location.href);
        // 更新查询参数
        url.searchParams.set('query', searchContentTemp.value);  // 你希望设置的新查询参数
        // 更新 URL，并刷新页面
        window.history.replaceState(null, '', url.href);  // 更新浏览器的历史记录
        location.reload();  // 强制刷新页面
      }
    }

    return{
      currSelectedKeys,
      indexLogin,
      items,
      isAvatarNull,
      avatar,
      userid,
      searchContentTemp,
      showToken,
      logout,
      initUserInfo,
      toIndex,
      toTags,
      handleClick,
      toUserHomePage,
      toWrite,
      toAdmin,
      getCurrSelectedKeys,
      onSearch,
      isAdmin
    }
  },

  mounted() {
    this.getCurrSelectedKeys();
    this.initUserInfo();
  }
}
</script>

<style lang="less" scoped>
#header {
  position: fixed;
  z-index: 999;
  width: 100%;
  background: #f0f2f5;
  border-bottom: 1px solid #00000021;
}

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
  margin:0 4px;
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
