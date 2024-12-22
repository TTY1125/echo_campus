<template>
  <IndexHeader class="header"/>
  <a-layout-content>
    <a-row style="padding-top: 64px;min-height: 800px">
      <a-col :span="16" :offset="4" style="margin-top: 35px;">
        <a-flex justify="space-between" style="width: 100%;display:flex;background-color:white;height:140px;">
          <a-flex>
            <a-avatar :size="88" :src="userData.profile_picture ? userData.profile_picture : require('@/assets/img/default_avatar.png')"
                      style="justify-self: start;margin: 20px 30px"/>

            <div class="user-info-right" style="margin: 30px 20px 0 0;">
              <div class="user-info-name" style="text-align: start;font-size: 20px;font-weight: bold">{{ userData.username }}</div>
              <div class="user-info-bio" style="text-align: start;font-size: 14px;margin: 10px 0 0 0">{{ userData.bio }}</div>
            </div>
          </a-flex>
          <a-flex :vertical="true" style="align-self: center">
            <a-button style="margin-right: 20px" v-if="!isSelf" @click="follow">关注</a-button>
            <a-button style="margin-right: 20px" v-if="isSelf" @click="toEditUserInfo">编辑个人资料</a-button>
          </a-flex>
        </a-flex>

        <div style="width: 100%;background-color:white;margin-top: 30px">
          <a-menu class="menu"
                  v-model:selectedKeys="selectedKeys"
                  mode="horizontal"
                  :items="menuItems"
                  style="caret-color: transparent"/>

          <PostList :postsList="userPostsList"/>

        </div>

      </a-col>

    </a-row>
  </a-layout-content>
</template>

<script>
import {h, reactive, ref} from 'vue';
import userInfoService from "@/service/userInfoService";
import {useApp} from "@/useApp";
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import {ProfileOutlined, HeartOutlined, StarOutlined} from "@ant-design/icons-vue";
import PostList from "@/components/index/PostList.vue";
import articleService from "@/service/articleService";
import dayjs from "dayjs";
import likeFavFowService from "@/service/likeFavFowService";
import commentService from "@/service/commentService";
export default {
  components: {PostList, IndexHeader},
  setup(){
    const {proxy,store,route,router} = useApp();
    const isSelf = ref(false);
    let isLoading = false;
    const userPostsList = reactive([]);
    const userFollowList = reactive([]);
    const userFavouriteList = reactive([]);
    const selectedKeys = ref(['post']);

    const menuItems = ref([
      {
        key: 'post',
        icon: () => h(ProfileOutlined),
        label: '文章',
      },
      {
        key: 'follow',
        icon: () => h(HeartOutlined),
        label: '关注',
      },
      {
        key: 'favourite',
        icon: () => h(StarOutlined),
        label: '收藏',
      },
    ]);
    const userData = ref({
      id: "",
      userName: "用户名",
      email: "邮箱",
      profile_picture: null,
      bio: "个性签名",
    });
    const getCurrentUserInfo = async () => {
      //Number(route.params.id)
      userInfoService.getOtherUserInfo(route.params.id)
          .then(res => {
            userData.value = res.data.data;
            console.log("初始获取用户信息：",userData);
            if(store.getters.getId === undefined || store.getters.getId === null){
              userInfoService.getUserInfo()
                  .then(res=>{
                    store.commit("setId",res.data.data.id);
                    if(userData.value.id === store.getters.getId){
                      isSelf.value = true;
                    }
                  })
                  .catch(err => {
                    console.log("获取用户信息错误: ", err);
                    //this.proxy.$message.error(err.desc);
                  })
            }else{
              if(userData.value.id === store.getters.getId){
                isSelf.value = true;
              }
            }
          })
          .catch(err => {
            console.log("获取用户信息错误: ", err);
          });
    };
    const toEditUserInfo = () =>{
      router.push('/settings');
    };
    const follow = async () =>{
      try {
        await likeFavFowService.follow(route.params.id);
        proxy.$message.success("关注成功");
      }catch (e) {
        proxy.$message.error("关注失败");
      }
    };
    const getMyArticles=async()=>{
      isLoading = true;
      try{
        const articleRes = await articleService.getPostOfUser(route.params.id);
        console.log("所有帖子",articleRes);
        let ret = articleRes.data.data;
        for(let i in ret){
          let currPost = {
            id: ret[i].id,
            user_id: ret[i].user_id,
            title: ret[i].title,
            content: ret[i].content,
            created_at: dayjs(ret[i].created_at),
            userName: null,
            avatar: null,
            lookNum: 0,
            likeNum: 0,
            commentNum: 0,
          };
          //查询作者信息
          try{
            let userRes = await userInfoService.getOtherUserInfo(currPost.user_id);
            currPost.userName = userRes.data.data.username;
            currPost.avatar = userRes.data.data.profile_picture;
          }catch (e) {
            currPost.userName = "账号已注销";
            currPost.avatar = "@/assets/img/default_avatar.png";
          }
          //查询浏览量，点赞量和评论量
          let postLikeNumRes = await likeFavFowService.getLikeNum(currPost.id,'','');
          currPost.likeNum = postLikeNumRes.data.data;
          let commentNumRes = await commentService.getComments(0,currPost.id);
          currPost.commentNum = commentNumRes.data.data.length;
          userPostsList.push(currPost);
        }
        isLoading = false;
      }catch(e){
        console.log("获取帖子错误",e);
      }
    };
    const handleScroll =  () => {
      const scrollHeight = document.documentElement.scrollHeight; // 文档总高度
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // 当前滚动的高度
      const windowHeight = window.innerHeight; // 浏览器窗口的高度

      // 如果滚动到接近底部，加载更多内容
      if (scrollHeight - scrollTop - windowHeight < 300 && !isLoading) {
        if(selectedKeys.value.includes("post")){
          getMyArticles(); // 加载更多帖子
        }
      }
    };
    return{
      userData,
      isSelf,
      menuItems,
      userPostsList,
      userFollowList,
      userFavouriteList,
      selectedKeys,
      getCurrentUserInfo,
      toEditUserInfo,
      getMyArticles,
      handleScroll,
      follow,
    };
  },
  async mounted(){
    this.getCurrentUserInfo();
    this.getMyArticles();
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 销毁组件时移除事件监听
  },
};

</script>

<style scoped lang="less">
.main-content{
  min-height: 1000px;
}
.menu:deep(.ant-menu-item){
  font-size: 18px!important;
}
.menu:deep(.anticon.ant-menu-item-icon){
  font-size: 18px!important;
}

</style>