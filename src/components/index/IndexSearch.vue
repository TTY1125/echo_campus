<template>
  <IndexHeader class="header"/>
  <a-layout-content>
    <a-row style="padding-top: 64px;min-height: 800px">
      <a-col :span="16" :offset="4" style="margin-top: 35px;">

        <PostList :posts-list="PostList"/>

      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script>

import {defineComponent, reactive} from "vue";
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import PostList from "@/components/index/PostList.vue";
import articleService from "@/service/articleService";
import {useApp} from "@/useApp";
import dayjs from "dayjs";
import userInfoService from "@/service/userInfoService";
import likeFavFowService from "@/service/likeFavFowService";

export default defineComponent({
  components: {PostList, IndexHeader},
  setup(){
    const {route} = useApp();
    const PostList = reactive([]);
    let offset = 0;
    let isLoading = false;
    const getPostList = async () =>{
      isLoading = true;
      try{
        let searchContent = route.query.query;
        let articleRes = await articleService.searchPost(searchContent,offset);
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
          let commentNumRes = await articleService.getPostAllCmtRep(currPost.id);
          currPost.commentNum = commentNumRes.data.data;
          //查询封面图片
          let picRes = await articleService.getPostPic(currPost.id);
          currPost.pic = picRes.data.data;
          PostList.push(currPost);
        }
      }catch (e) {
        console.log("搜索错误",e);
      }
      offset+=20;
      isLoading = false;
    }

    const handleScroll =  () => {
      const scrollHeight = document.documentElement.scrollHeight; // 文档总高度
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // 当前滚动的高度
      const windowHeight = window.innerHeight; // 浏览器窗口的高度

      // 如果滚动到接近底部，加载更多内容
      if (scrollHeight - scrollTop - windowHeight < 300 && !isLoading) {
        getPostList(); // 加载更多帖子
      }
    };

    return{
      PostList,
      getPostList,
      handleScroll,
    }
  },
  mounted() {
    this.getPostList();
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 销毁组件时移除事件监听
  },
})
</script>

<style scoped lang="less">

</style>