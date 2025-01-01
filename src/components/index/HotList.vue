<template>

  <a-list item-layout="vertical" :data-source="hotPostList"><!-- postsListShow传入data-source，拆解成#renderItem后给item -->
    <template #renderItem = "{ item }"><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
      <a-list-item class="list-item" @click="goToDetail(item.post_id)" style="cursor: pointer">

        <a-flex  style="caret-color: transparent;margin: 4px 0 ;padding:0 14px;align-content: center" >
          <span style="font-size: 18px;font-style: italic;font-weight: bold">{{item.index}}</span>
          <span class="hot-post-title" style="align-content:center;font-size: 14px;margin-left: 10px;text-align: start">{{item.title}}</span>
          <FireFilled style="margin-left: 10px;color: rgb(0,0,0,0.4)"/>
          <span style="align-content:center;font-size: 14px;color: rgb(0,0,0,0.4)">{{item.hotness}}</span>
        </a-flex>
      </a-list-item>

    </template>
  </a-list>

</template>

<script>
import {FireFilled} from "@ant-design/icons-vue";
import {useApp} from "@/useApp";
import articleService from "@/service/articleService";
import {reactive} from "vue";

export default {
  components: {FireFilled},

  setup(){
    const {router} = useApp();
    const hotPostList = reactive([]);
    const goToDetail = id =>{
      router.push("/detail/"+id);
    };

    const getHotArticles=async()=>{
      try{
        const articleRes = await articleService.getHotPost();
        let resData = articleRes.data.data;
        for(let i in resData){
          hotPostList.push(resData[i]);
          hotPostList[i].index = Number(i)+1;
        }
      }catch(e){
        console.log("获取热门帖子错误",e);
      }
    };

    return{
      hotPostList,
      goToDetail,
      getHotArticles,
    }
  },
  mounted() {
    this.getHotArticles();
  }
}
</script>

<style scoped lang="less">

.ant-list-item{
  padding:0;
}
.anticon,.anticon-fire{
  align-content: center;
}
.hot-post-title{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>