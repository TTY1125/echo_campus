<template>
  <a-layout id="components-layout-basic" style="background-color:#f0f2f5;">
    <IndexHeader class="header"/>

    <a-layout-content style="padding-top: 74px;z-index: 0;">
      <main class="main-content" style="display: flex;">
        <a-col :lg="{span:13,offset:3}" :xs="{span:20,offset:2}">

          <div class="title_content" style="background-color: white;padding: 20px 30px;">
            <span style="font-weight: bold;font-size: 32px;display: flex;text-align: start">{{postTitle}}</span>

            <a-flex style="margin-top: 10px;justify-content: flex-start">
              <a-avatar :src="postAuthorAvatar" :size="46" @click="toUserHomePage(postAuthorId)" style="cursor: pointer"/>
              <a-flex vertical="vertical" style="justify-content: space-between;text-align: start;margin-left: 10px">
                <span style="font-size: 19px">{{postAuthorName}}</span>
                <span style="font-size: 14px">{{postCreatedAt}}</span>
              </a-flex>
              <FollowButton :id="postAuthorId" v-if="userId!==postAuthorId" style="margin-left: auto;align-self: center"/>
            </a-flex>

            <a-row style="margin-top: 10px;" v-if="postLabels.length>0">
              <span style="font-weight: bold; margin-right: 8px;">标签:</span> <!-- 标签前的文本 -->
              <a-col v-for="(label, index) in postLabels" :key="index" style="margin-right: 8px;">
                <a-tag color="blue"
                       @click="handleLabelClick(label)"
                       :style="{cursor: 'pointer'}"
                >{{ label.label_name }}</a-tag>
              </a-col>
            </a-row>

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

            <!-- 文章点赞与收藏 --><!-- 两个靠左一个靠右 -->
            <a-flex style="justify-content: flex-start;">
              <a-button size="large" @click="likePost">
                <LikeOutlined v-if="!postIsLiked"/>
                <LikeFilled v-if="postIsLiked"/>
                <span>点赞: {{postLikeNum}}</span>
              </a-button>

              <a-button size="large" @click="favouritePost" style="margin-left: 20px;">
                <StarOutlined v-if="!postIsFavourite"/>
                <StarFilled v-if="postIsFavourite"/>
                <span>收藏: {{postFavouriteNum}}</span>
              </a-button>

              <a-button size="large" @click="reportPost" style="margin-left: 20px;" v-if="userId!==postAuthorId">
                <span>举报</span>
              </a-button>

              <a-button v-if="userId===postAuthorId" size="large" @click="deletePost" style="margin-left: auto;">
                <DeleteOutlined/>
                <span>删除文章</span>
              </a-button>
            </a-flex>

          </div>

          <div style="width: 100%;min-height: 300px;display:flex;flex-direction:column;background-color:white;margin-top: 20px;padding: 20px 30px;">

            <articleComments :avatar="avatar" :postId="postId" :postAuthorId="postAuthorId" :userId="userId"/>

          </div>

        </a-col>

        <!-- 侧栏 -->
        <a-col class="sider" :lg="{span:5}" :sm="{span:0}" :xs="{span:0}" style="border-left: 20px solid #f0f2f5">
          <div style="margin-bottom: 20px;height: 200px;  background-color: white;  align-content: center;justify-content: center;">
            <!-- <h3 style="font-size: 24px;font-weight: bold;">回声校园</h3> -->
            <a-flex vertical="vertical" style="justify-content: center;align-items: center;margin:0 10px">
              <img src="../../assets/img/logo1.png" alt="logo_img" style="height: 50px;width: 140px"/>
              <span style="font-size: 14px;line-height: 28px">
                星光之下，回声流转；心灵之间，知音相见。
                无论是徜徉知识海洋，还是静听风起花落，
                让我们在回声里相遇，点亮属于彼此的星河。
              </span>
            </a-flex>
          </div>
          <!-- position: sticky; top:64px; -->

          <a-flex vertical="vertical" style="margin-bottom: 20px;background-color: white;padding: 18px 0">
            <a-flex style="height: 30px;align-content: center;align-self: center">
              <FireOutlined style="font-size: 20px;margin-right: 10px"/>
              <span style="font-weight: bold;font-size: 20px;align-content:center;">热门文章</span>
            </a-flex>
            <HotList/>
          </a-flex>

        </a-col>

        <a-modal v-model:visible="isModalVisible" title="举报原因" @ok="handleSave(form)" @cancel="handleCancel">
          <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="举报原因" :name="'user_reason'">
              <a-input v-model:value="form.user_reason" />
            </a-form-item>
          </a-form>
        </a-modal>

      </main>
    </a-layout-content>
  </a-layout>

</template>

<script>
import {LikeOutlined, LikeFilled, StarOutlined, StarFilled, DeleteOutlined, FireOutlined} from '@ant-design/icons-vue';
import {useApp} from "@/useApp";
import {ref, reactive} from "vue";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import FollowButton from "@/components/button/FollowButton.vue";
import articleComments from "@/components/articleDetail/ArticleComments.vue";
import articleService from "@/service/articleService";
import userInfoService from "@/service/userInfoService";
import likeFavFowService from "@/service/likeFavFowService";
import "dayjs/locale/zh-cn";
import reportService from "@/service/reportService";
import labelService from "@/service/labelService";
import {useRouter} from 'vue-router';
import HotList from "@/components/index/HotList.vue";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  components: {
    FireOutlined,
    HotList,
    IndexHeader,LikeOutlined,LikeFilled,articleComments,StarOutlined,StarFilled,DeleteOutlined,FollowButton},
  setup(){
    const { route, store, proxy } = useApp();
    const isAvatarNull = ref(true);
    const avatar = ref(null);
    const postTitle = ref('');
    const postContent = ref('');
    const postId = ref(-1);
    const postAuthorId = ref(-1);
    const postAuthorAvatar = ref(null);
    const postAuthorName = ref(null);
    const postCreatedAt = ref(null);
    const postIsLiked = ref(false);
    const postIsFavourite = ref(false);
    const postLikeNum = ref(0);
    const postFavouriteNum = ref(0);
    const userId = ref(-1);
    const postLabels = reactive([]);
    const router = useRouter();

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
        let ifMyFavourite = await likeFavFowService.getIfMyFavourite(postId.value,'','');
        postIsFavourite.value = ifMyFavourite.data.data===1;
        let postLikeNumRes = await likeFavFowService.getLikeNum(postId.value,'','');
        postLikeNum.value = postLikeNumRes.data.data;
        let postFavouriteNumRes = await likeFavFowService.getFavouriteNum(postId.value);
        postFavouriteNum.value = postFavouriteNumRes.data.data;
        let postRes = await articleService.getArticleById(route.params.id);
        postTitle.value = postRes.data.data.title;
        postContent.value = postRes.data.data.content;
        postCreatedAt.value = dayjs(postRes.data.data.created_at).format('YYYY-MM-DD HH:mm:ss');
        postAuthorId.value = postRes.data.data.user_id;
        let userRes = await userInfoService.getOtherUserInfo(postAuthorId.value);
        postAuthorName.value = userRes.data.data.username;
        postAuthorAvatar.value = userRes.data.data.profile_picture;
        userId.value = store.getters.getId;

        //获取标签数据
        const labelRes = await labelService.getLabelOfPost(postId.value);
        let ret = labelRes.data.data;
        console.log("labels: ", ret);
        for(let i in ret) {
          let currLabel = {
            id: ret[i].id,
            label_name: ret[i].label_name,
            description: ret[i].description,
            label_icon: ret[i].label_icon,
            created_at: dayjs(ret[i].created_at),
          };
          postLabels.push(currLabel);
        }

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

    const toIndex = () => {
      router.push('/');
    };

    const deletePost = async ()=>{
      try{
        await articleService.deletePost(postId.value);
        proxy.$message.success("文章删除成功");
        toIndex();
      }catch (e) {
        proxy.$message.error("文章删除失败");
        console.log("删除失败",e);
      }
    };


    const favouritePost = async ()=>{
      try{
        if(!postIsFavourite.value){//点赞
          await likeFavFowService.favourite({post_id:postId.value});
          postIsFavourite.value = true;
        }else{//取消点赞
          await likeFavFowService.notFavourite(postId.value);
          postIsFavourite.value = false;
        }
        let postFavouriteNumRes = await likeFavFowService.getFavouriteNum(postId.value);
        postFavouriteNum.value = postFavouriteNumRes.data.data;
      }catch (e) {
        proxy.$message.error("收藏处理失败");
        console.log("收藏处理失败",e);
      }
    };

    const follow = async () =>{
      try {
        await likeFavFowService.follow(postAuthorId);
        proxy.$message.success("关注成功");
      }catch (e) {
        proxy.$message.error("关注失败");
      }
    };

    const isModalVisible = ref(false);  // 控制弹窗显示
    const form = reactive({
      id: '',
      post_id: '',
      user_id: '',
      user_reason: '',
      admin_reason: '',
      created_at: '',
      is_handled: '',

      post_title: '',
      post_content: '',
      user_name: '',
    });
    const reportPost = async() => {
      if(store.state.isLogin){
        try{
          let userRes = await userInfoService.getUserInfo();
          let userid = userRes.data.data.id;
          if(store.id === null && userid){
            store.commit("setId",userid);
          }
          form.post_id = route.params.id;
          form.user_id = userid;
        }catch(e){
          console.log("获取用户信息错误: ",e);
          proxy.$message.error("获取用户信息错误");
        }
      }
      isModalVisible.value = true;  // 显示弹窗
    };
    const handleSave = async () => {
      try {
        form.is_handled = 0;
        await reportService.addUserInfo(form);
        isModalVisible.value = false;  // 隐藏弹窗
        proxy.$message.success("举报成功");
        proxy.$router.go(0); //刷新了一下界面
      } catch (error) {
        console.error('举报失败', error);
      }
    }
    const handleCancel = () => {
      isModalVisible.value = false;  // 隐藏弹窗
    };
    const handleLabelClick = (label) => {
      router.push('/label/' + label.id);
    };
    const toUserHomePage = userId =>{
      if(userId){
        router.push('/user/'+userId);
      }else{
        proxy.$message.error("无法获取userid")
      }
    };
    return{
      postTitle,
      postContent,
      postLikeNum,
      postFavouriteNum,
      isAvatarNull,
      avatar,
      userId,
      postAuthorId,
      postAuthorAvatar,
      postAuthorName,
      postId,
      postCreatedAt,
      postIsLiked,
      postIsFavourite,
      gerCurrentArticle,
      initUserInfo,
      likePost,
      deletePost,
      favouritePost,
      follow,
      reportPost,
      handleSave,
      handleCancel,
      isModalVisible,
      form,
      postLabels,
      handleLabelClick,
      toUserHomePage,
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