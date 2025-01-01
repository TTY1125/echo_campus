<template>

    <a-list item-layout="vertical" :data-source="postsList"><!-- postsListShow传入data-source，拆解成#renderItem后给item -->
      <template #renderItem = "{ item }"><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
        <a-list-item class="list-item" @click="goToDetail(item.post_id)">

          <a-flex  style="caret-color: transparent;margin: 4px 0 ;padding:0 14px;align-content: center" >
            <span style="font-size: 18px">{{item.index}}</span>
            <span class="hot-post-title" style="align-content:center;font-size: 16px;margin-left: 10px">{{item.title}}</span>
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

export default {
  components: {FireFilled},
  props:{
    postsList: {
      type: Array,
      default: () => [
        {
          index:1,
          id:1,
          title:"文章测试标题",
          hotPoint:888,
        },
        {
          index:2,
          id:2,
          title:"测试文章标题",
          hotPoint:555,
        },
      ]
    },
  },
  setup(){
    const {router} = useApp();

    const goToDetail = id =>{
      router.push("/detail/"+id);
    };

    return{
      goToDetail,
    }
  },

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