<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content style="margin-top:74px;z-index: 0">
      <main class="main-content" style="display: flex;">
        <a-col :lg="{span:14,offset:2}" :xs="{span:20,offset:2}">

          <div class="title_content" style="background-color: white;padding: 20px 30px;">
            <span style="font-weight: bold;font-size: 32px;display: flex;">{{postTitle}}</span>
            <div class="article-content" style="width: 100%" v-if="postContent">
              <mavon-editor
                  v-model="postContent"
                  :subfield="false"
                  defaultOpen="preview"
                  :toolbarsFlag="false"
                  boxShadowStyle="0"
                  previewBackground="#fff"
                  codeStyle="obsidian"
                  :xssOptions=false></mavon-editor>
            </div>

            <a-divider/>

            <!-- 文章点赞 -->
            <a-flex>
              <a-button size="large" @click="likePost">
                <LikeOutlined v-if="!post_is_liked"/>
                <LikeFilled v-if="post_is_liked"/>
                <span>点赞: {{postLikeNum}}</span>
              </a-button>
            </a-flex>

          </div>

          <div style="width: 100%;min-height: 300px;display:flex;flex-direction:column;background-color:white;margin-top: 20px;padding: 20px 30px;">

            <articleComments :avatar="avatar" :postId="postId" :postAuthorId="postAuthorId" :userId="userId"/>

          </div>

        </a-col>

        <!-- 侧栏 -->
        <a-col class="sider" :lg="{span:6}" :sm="{span:0}" :xs="{span:0}" style="border-left: 20px solid #f0f2f5">
          <div style="margin-bottom: 20px;height: 200px;  background-color: white;  align-content: center;justify-content: center;">
            <!-- <h3 style="font-size: 24px;font-weight: bold;">回声校园</h3> -->
            <img src="../../assets/img/logo1.png" alt="logo_img" style="height: 56px"/>
          </div>
          <!-- position: sticky; top:64px; -->
          <div style="margin-bottom: 20px;height: 400px;  background-color: white; text-align: start;  align-items: start;justify-items: start;">
            <span style="font-weight: bold"></span><br/>
            <span style="font-weight: bold"></span>
          </div>
        </a-col>

      </main>
    </a-layout-content>
  </a-layout>

</template>

<script>
import {LikeOutlined,LikeFilled} from '@ant-design/icons-vue';
import {useApp} from "@/useApp";
import {ref} from "vue";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import articleComments from "@/components/articleDetail/ArticleComments.vue";
import articleService from "@/service/articleService";
import userInfoService from "@/service/userInfoService";
import likeFavFowService from "@/service/likeFavFowService";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  components: {IndexHeader,LikeOutlined,LikeFilled,articleComments},
  setup(){
    const { route, store, proxy } = useApp();
    const isAvatarNull = ref(true);
    const avatar = ref(null);
    const postTitle = ref('');
    const postContent = ref('');
    const postId = ref(-1);
    const postAuthorId = ref(-1);
    const postIsLiked = ref(false);
    const postLikeNum = ref(0);
    const userId = ref('');

    const gerCurrentArticle = async() =>{
      postId.value = Number(route.params.id);
      if(route.params.id === '114514'){
        postTitle.value = "测试标题";
        postContent.value = "<p>正文标题</p>";
        return;
      }
      try{
        let ifMyLike = await likeFavFowService.getIfMyLike(postId.value,'','');
        postIsLiked.value = ifMyLike.data.data===1;
        let postLikeNumRes = await likeFavFowService.getLikeNum(postId.value,'','');
        postLikeNum.value = postLikeNumRes.data.data;
        let postRes = await articleService.getArticleById(route.params.id);
        postTitle.value = postRes.data.data.title;
        postContent.value = postRes.data.data.content;
        postAuthorId.value = postRes.data.data.user_id;
        userId.value = store.getters.getId;
      }catch (e) {
        proxy.$message.error("获取文章信息出错");
        console.log("获取文章信息出错",e);
      }
    };

    const initUserInfo = async () =>{
      if(store.state.isLogin){
        try{
          let userRes = await userInfoService.getUserInfo();
          isAvatarNull.value = false;
          avatar.value = userRes.data.data.profile_picture;
          let userid = userRes.data.data.id;
          if(store.id === null && userid){
            store.commit("setId",userid);
          }
        }catch(e){
          console.log("获取用户信息错误: ", e);
          proxy.$message.error("获取用户信息错误");
        }
      }
    };

    const likePost = async ()=>{
      try{
        if(!postIsLiked.value){//点赞
          await likeFavFowService.like({post_id:postId.value});
          postIsLiked.value = true;
        }else{//取消点赞
          await likeFavFowService.notLike({post_id:postId.value});
          postIsLiked.value = false;
        }
        let postLikeNumRes = await likeFavFowService.getLikeNum(postId.value,'','');
        postLikeNum.value = postLikeNumRes.data.data;
      }catch (e) {
        proxy.$message.error("点赞处理失败");
        console.log("点赞处理失败",e);
      }
    };

    return{
      postTitle,
      postContent,
      postLikeNum,
      isAvatarNull,
      avatar,
      userId,
      postAuthorId,
      postId,
      post_is_liked: postIsLiked,
      gerCurrentArticle,
      initUserInfo,
      likePost,
    }
  },
  mounted() {
    this.initUserInfo();
    this.gerCurrentArticle();
  }
};
</script>

<style scoped lang="less">
/* mavon-editor整体样式--start */
:deep(.scroll-style.scroll-style-border-radius.v-show-content) {
  padding: 10px 0;
}
.ant-list-item{
  padding: 0;
}
:deep(.ant-list-header) {
  text-align: start;
}
:deep(.ant-comment-content) {
  text-align: start;
}

</style>