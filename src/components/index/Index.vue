<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="main-content" style="min-height: 756px">
        <a-col :lg="{span:13,offset:3}" :xs="{span:20,offset:2}">
          <!-- 走马灯 -->
          <IndexCarousel style="margin-bottom: 10px" />
          <!-- 首页帖子 -->
          <IndexPosts :postsList="indexPostsList"/>
        </a-col>

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

      </main>
    </a-layout-content>

  </a-layout>
</template>


<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import { FireOutlined } from '@ant-design/icons-vue';
import IndexCarousel from "@/components/index/IndexCarousel.vue";
import IndexPosts from "@/components/index/PostList.vue";
import HotList from "@/components/index/HotList.vue";
import {reactive} from "vue";
import articleService from "@/service/articleService";
import likeFavFowService from "@/service/likeFavFowService";
import dayjs from "dayjs";
import userInfoService from "@/service/userInfoService";
export default {
  components:{
    HotList,
    IndexCarousel,
    IndexHeader,
    IndexPosts,
    FireOutlined,
  },
  setup(){
    const indexPostsList = reactive([]);
    let currIndex = 0;
    let isLoading = false;
    const getIndexArticles=async()=>{
      isLoading = true;
      try{
        const articleRes = await articleService.getUnreportedArticles(currIndex);
        currIndex+=10;
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
          indexPostsList.push(currPost);
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
        getIndexArticles(); // 加载更多帖子
      }
    };

    return{
      indexPostsList,
      getIndexArticles,
      handleScroll,
    }
  },
  mounted() {
    this.getIndexArticles();
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 销毁组件时移除事件监听
  },
  
  name: 'App',
}

</script>

<style lang="less" scoped>
#components-layout-basic .main-content {
  padding-top: 74px;
  width: 100%;
  display:flex;
  background-color: #f0f2f5;
  //background-image:url('@/assets/img/back1.png');
  //background-size: 20% auto;
  background-repeat:repeat;
}

#components-layout-basic .sider {
  width:100%;
  //position: sticky;
  //top:64px;
  //z-index: 900;
  .anticon,.anticon-fire{
    align-content: center;
  }
}

</style>
