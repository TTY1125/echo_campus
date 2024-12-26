<template>
  <IndexHeader class="header"/>
  <a-layout-content>
    <a-row style="padding-top: 64px;min-height: 800px">
      <a-col :span="16" :offset="4" style="margin-top: 35px;">
        <a-flex justify="space-between" style="width: 100%;display:flex;background-color:white;height:140px;">
          <a-flex>
            <a-avatar :size="88" :src="userData.profile_picture ? userData.profile_picture : require('@/assets/img/default_avatar.png')"
                      style="margin: 20px 30px;flex-shrink: 0"/>

            <div class="user-info-right" style="margin: 30px 20px 0 0;">
              <div class="user-info-name" style="text-align: start;font-size: 20px;font-weight: bold">{{ userData.username }}</div>
              <div class="user-info-bio" style="text-align: start;font-size: 14px;margin: 10px 0 0 0">{{ userData.bio }}</div>
            </div>
          </a-flex>
          <a-flex :vertical="true" style="align-self: center;margin-right: 20px">
            <FollowButton :id="userId" v-if="!isSelf"/>

            <a-button style="margin-right: 20px" v-if="isSelf" @click="toEditUserInfo">编辑个人资料</a-button>
          </a-flex>
        </a-flex>

        <div style="width: 100%;background-color:white;margin-top: 30px">
          <a-menu class="menu"
                  v-model:selectedKeys="selectedKeys"
                  mode="horizontal"
                  :items="menuItems"
                  style="caret-color: transparent"/>

          <PostList :postsList="userPostsList" v-if="selectedKeys.includes('post')"/>
          <UserList :dataList="userFollowList" v-if="selectedKeys.includes('follow')"/>
          <PostList :postsList="userFavouriteList" v-if="selectedKeys.includes('favourite')"/>


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
import UserList from "@/components/userInfo/UserList.vue";
import FollowButton from "@/components/button/FollowButton.vue";
import articleService from "@/service/articleService";
import dayjs from "dayjs";
import likeFavFowService from "@/service/likeFavFowService";
import commentService from "@/service/commentService";
// import reportService from "@/service/reportService";

export default {
  components: {PostList, IndexHeader, FollowButton,UserList},
  setup(){
    const {store,route,router,proxy} = useApp();
    const isSelf = ref(false);
    let isLoading = false;
    const userPostsList = reactive([]);
    let userFollowListOffset = 0;
    const userFollowList = reactive([
      // {
      //   id: 1,
      //   username: "用户名",
      //   bio:"个性签名",
      // },
    ]);
    const userFavouriteList = reactive([]);
    const selectedKeys = ref(['post']);
    const userId = ref(-1);
    const userData = ref({
      id: "",
      userName: "用户名",
      email: "邮箱",
      profile_picture: null,
      bio: "个性签名",
    });

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

    const getCurrentUserInfo = async () => {
      try {
        const infoRes = await userInfoService.getOtherUserInfo(route.params.id);
        userData.value = infoRes.data.data;
        userId.value = infoRes.data.data.id;
        console.log("初始获取用户信息：",userData);
        if(store.getters.isLoggedIn){
          isSelf.value = store.getters.getId === userData.value.id;
        }
      }catch (e) {
        console.log("获取用户信息错误: ", e);
      }
    };
    const toEditUserInfo = () =>{
      router.push('/settings');
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
            is_handled: ret[i].is_handled,
            pic: null,
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
          //查询封面图片
          let picRes = await articleService.getPostPic(currPost.id);
          currPost.pic = picRes.data.data;
          // let reportRes = await reportService.getFirstReportInfo(currPost.id);
          // console.log("reportRes: ",reportRes)
          // if(reportRes.data.data.is_handled !== 1){
          //   userPostsList.push(currPost);
          // }
          userPostsList.push(currPost);
        }
      }catch(e){
        console.log("获取帖子错误",e);
      }
      isLoading = false;
    };

    const getFollowList = async () =>{
      isLoading = true;
      try {
        const idRes = await likeFavFowService.getFollowList(route.params.id,userFollowListOffset);
        if(idRes.data.data.length===0){
          return;
        }
        let ret = idRes.data.data;
        for(let i in ret) {
          const userRes = await userInfoService.getOtherUserInfo(ret[i].followed_id);
          let currUser = userRes.data.data;
          console.log(currUser);
          userFollowList.push(currUser);
        }
        userFollowListOffset+=10;
      }catch (e) {
        proxy.$message.error("获取关注列表失败");
      }
      isLoading = false;
    }

    const getFavouriteList = async () =>{
      isLoading = true;
      try {
        const articleRes = await likeFavFowService.getFavouriteList(route.params.id);
        console.log("所有帖子",articleRes);
        let ret = articleRes.data.data;
        for(let i in ret) {
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
            is_handled: ret[i].is_handled,
            pic: null,
          };
          //查询作者信息
          try {
            let userRes = await userInfoService.getOtherUserInfo(currPost.user_id);
            currPost.userName = userRes.data.data.username;
            currPost.avatar = userRes.data.data.profile_picture;
          } catch (e) {
            currPost.userName = "账号已注销";
            currPost.avatar = "@/assets/img/default_avatar.png";
          }
          //查询浏览量，点赞量和评论量
          let postLikeNumRes = await likeFavFowService.getLikeNum(currPost.id, '', '');
          currPost.likeNum = postLikeNumRes.data.data;
          let commentNumRes = await commentService.getComments(0, currPost.id);
          currPost.commentNum = commentNumRes.data.data.length;
          //查询封面图片
          let picRes = await articleService.getPostPic(currPost.id);
          currPost.pic = picRes.data.data;
          // let reportRes = await reportService.getFirstReportInfo(currPost.id);
          // console.log("reportRes: ",reportRes)
          // if(reportRes.data.data.is_handled !== 1){
          //   userPostsList.push(currPost);
          // }
          userFavouriteList.push(currPost);
        }
      }catch (e) {
        proxy.$message.error("获取关注列表失败");
      }
      isLoading = false;
    }

    const handleScroll =  () => {
      const scrollHeight = document.documentElement.scrollHeight; // 文档总高度
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // 当前滚动的高度
      const windowHeight = window.innerHeight; // 浏览器窗口的高度

      // 如果滚动到接近底部，加载更多内容
      if (scrollHeight - scrollTop - windowHeight < 300 && !isLoading) {
        if(selectedKeys.value.includes("post")){
          //现在是获取用户发的所有帖子，所以不存在获取更多
          //getMyArticles(); // 加载更多帖子
        }
        if(selectedKeys.value.includes("follow")){
          getFollowList(); // 加载更多关注
        }
        if(selectedKeys.value.includes("favourite")){
          //现在是获取用户的所有收藏，所以不存在获取更多
          //getFavouriteList(); // 加载更多收藏
        }
      }
    };
    return{
      userData,
      userId,
      isSelf,
      menuItems,
      userPostsList,
      userFollowList,
      userFavouriteList,
      selectedKeys,
      getCurrentUserInfo,
      toEditUserInfo,
      getMyArticles,
      getFollowList,
      getFavouriteList,
      handleScroll,
    };
  },
  async mounted(){
    await this.getCurrentUserInfo();
    await this.getMyArticles();
    await this.getFollowList();
    await this.getFavouriteList();
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