<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <div class="content-wrapper">
<!--      <a-avatar class="avatar" :size="60" :src="labelData.label_icon"/>-->
      <a-badge :count="labelData.post_num" class="avatar-badge">
        <a-avatar class="avatar" :size="60" :src="labelData.label_icon" />
        <div class="title">{{ labelData.label_name }}</div>
        <div class="article-count">
          {{ labelData.post_num || 0 }} 篇文章
        </div>
      </a-badge>
      <PostList :postsList="indexLabelsList"/>
    </div>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import {useApp} from "@/useApp";
import {ref, reactive} from 'vue';
import labelService from "@/service/labelService";
import dayjs from "dayjs";
import PostList from "@/components/index/PostList.vue";
import userInfoService from "@/service/userInfoService";
import commentService from "@/service/commentService";
import likeFavFowService from "@/service/likeFavFowService";

export default {
  components: {PostList, IndexHeader},
  setup(){
    const {route} = useApp();
    let isLoading = false;
    const indexLabelsList = reactive([]);
    const labelData = ref({
      id: "",
      label_name: "标签名",
      description: "描述",
      label_icon: null,
    });
    const getCurrentLabelInfo = async () => {
      //先获取label本身的信息
      try {
        const infoRes = await labelService.getOtherLabelInfo(route.params.id);
        labelData.value = infoRes.data.data;
        console.log("获取标签信息：", labelData);
      }catch (e) {
        console.log("获取标签信息错误: ", e);
      }
    };

    const getLabelList = async () => {
      //再获取label对应的所有文章
      isLoading = true;
      try{
        const articleRes = await labelService.getPostOfLabel(route.params.id);
        let ret = articleRes.data.data;
        console.log("获取文章列表：", ret);
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
          indexLabelsList.push(currPost);
        }
        isLoading = false;
      }catch(e){
        console.log("获取标签错误",e);
      }

    };

    const handleScroll =  () => {
      const scrollHeight = document.documentElement.scrollHeight; // 文档总高度
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // 当前滚动的高度
      const windowHeight = window.innerHeight; // 浏览器窗口的高度

      // 如果滚动到接近底部，加载更多内容
      if (scrollHeight - scrollTop - windowHeight < 300 && !isLoading) {
        getLabelList();// 加载更多标签
      }
    };


    return {
      labelData,
      getCurrentLabelInfo,
      handleScroll,
      getLabelList,
      indexLabelsList,
      IndexHeader
    };
  },
  async mounted(){
    this.getCurrentLabelInfo();
    this.getLabelList();
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },

  name: "LabelDetail"
}
</script>

<style scoped>
.content-wrapper {
  margin-top: 80px; /* 根据 IndexHeader 的高度调整 */
}
</style>