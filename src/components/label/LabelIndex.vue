<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="main-content">
        <LabelContent :data="indexLabelsList"/>
      </main>
    </a-layout-content>

  </a-layout>
</template>


<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import LabelContent from "@/components/label/LabelContent";
import labelService from "@/service/labelService";
import { reactive} from "vue";
import dayjs from "dayjs";
export default {
  components:{
    IndexHeader,
    LabelContent,
  },
  setup(){
    let currIndex = 0;
    let isLoading = false;
    const indexLabelsList = reactive([]);

    // 获取所有标签
    const getLabelList = async () => {
      isLoading = true;
      try{
        const labelRes = await labelService.getAllLabelsInfo(currIndex);
        currIndex+=20;
        let ret = labelRes.data.data;
        for(let i in ret){
          let currLabel = {
            id: ret[i].id,
            label_name: ret[i].label_name,
            description: ret[i].description,
            label_icon: ret[i].label_icon,
            created_at: dayjs(ret[i].created_at),
            post_num: ret[i].post_num,
          };
          // //查询浏览量，点赞量和评论量
          // let postLikeNumRes = await likeFavFowService.getLikeNum(currPost.id,'','');
          // currPost.likeNum = postLikeNumRes.data.data;
          // let commentNumRes = await articleService.getPostAllCmtRep(currPost.id);
          // currPost.commentNum = commentNumRes.data.data;
          // //查询封面图片
          // let picRes = await articleService.getPostPic(currPost.id);
          // currPost.pic = picRes.data.data;
          indexLabelsList.push(currLabel);
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

    return{
      handleScroll,
      getLabelList,
      indexLabelsList
    }
  },
  mounted() {
    this.getLabelList();
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 销毁组件时移除事件监听
  },
  
  name: 'LabelIndex',
}

</script>

<style lang="less" scoped>
#components-layout-basic .main-content {
  padding-top: 74px;
  width: 100%;
  display:flex;
  background-color: #f0f2f5;
  //background-image:url('@/assets/img/back1.png');

  background-repeat:repeat;
}

#components-layout-basic .sider {
  width:100%;
  //position: sticky;
  //top:64px;
  //z-index: 900;
}

</style>
