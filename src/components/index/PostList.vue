<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" :data-source="postsList"><!-- postsListShow传入data-source，拆解成#renderItem后给item -->
      <template #renderItem = "{ item }"><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
        <a-list-item class="list-item" @click="goToDetail(item.id)">
          <a-flex  style="caret-color: transparent;margin: 6px 0 6px 0" >
            <div class="index-post-pic" style="height: 130px;width: 180px;flex-shrink: 0;margin-right: 12px;"><!-- 一定要加上flex-shrink呀！ -->
              <img :src="item.pic" style="height: 135px;width: 180px;object-fit: cover;" alt="index_post_img" />
            </div>

            <a-col class="index-post-right">
              <div class="index-post-title">{{ item.title }}</div>
              <div class="index-post-content">{{ item.content }}</div>
              <a-flex class="index-post-extra" style="color: rgba(0,0,0,0.7);align-items: center">
                <!--
                <EyeOutlined style="margin-right: 6px;font-size: 20px;"/>
                <span style="line-height: 20px;margin-right: 10px">{{ item.lookNum }}</span>
                -->
                <LikeOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 10px">{{ item.likeNum }}</span>
                <MessageOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 15px;">{{ item.commentNum }}</span>
                <a-avatar :src="item.avatar" @click.stop="toUserHomePage(item.user_id)" :size="30"/>
                <span style="margin-left: 4px">{{ item.userName }}</span>

                <a-tooltip :title="item.created_at.format('YYYY-MM-DD HH:mm:ss')">
                  <span style="margin-left: 15px;color: rgba(0,0,0,0.7)">{{ item.created_at.fromNow() }}</span>
                </a-tooltip>

                <span v-if="item.is_handled" class="post-status">
                    被举报
                </span>
                <span v-if="item.is_deleted" class="post-status">
                    被审核删除
                </span>

              </a-flex>
            </a-col>

          </a-flex>
        </a-list-item>

      </template>
    </a-list>

    <a-empty v-if="postsList.length>0" style="margin-top: 20px">
      <template #description>
        <span>
          没有更多啦~
        </span>
      </template>
    </a-empty>

  </div>
</template>

<script>
import {LikeOutlined,MessageOutlined } from '@ant-design/icons-vue';
import {useApp} from "@/useApp";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  components: {
    LikeOutlined,
    MessageOutlined
  },
  props: {
    postsList: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const {router,proxy} = useApp();

    const goToDetail = id =>{
      router.push("/detail/"+id);
    };
    const toUserHomePage = userId =>{
      if(userId){
        router.push('/user/'+userId);
      }else{
        proxy.$message.error("无法获取userid")
      }
    };

    return {
      goToDetail,
      toUserHomePage,
    };
  },
}
</script>

<style lang="less" scoped>
.index-post-right{
  height: 135px;
  justify-items: start;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.index-post-right > .index-post-title{
  font-size: 18px;
  text-align: start;
  font-weight: bold;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.index-post-right > .index-post-content{
  font-size: 14px;
  text-align: left;
  color: rgba(0,0,0,0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 22px;
  max-height: 44px;//这里必须加上高度限制，否则行数钳制不生效
}
.list-item{
  background-color: white;
  transition: background-color 0.3s ease; /* 平滑过渡效果 */
  cursor: pointer;
}
.list-item:hover{
  background-color: #f9f9f9;
}

.post-status {
  font-size: 14px;
  color: red;
  margin-left: 10px; /* 与标题保持间距 */
}
</style>