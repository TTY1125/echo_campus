<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" :data-source="dataList"><!-- postsListShow传入data-source，拆解成#renderItem后给item -->
      <template #renderItem = "{ item }"><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
        <a-list-item class="list-item" @click="toUserHomePage(item.id)">

          <a-flex style="justify-content: flex-start">
            <a-avatar src="item.avatar"/>
            <a-flex vertical="vertical">
              <div class="user-info-name" style="text-align: start;font-size: 20px;font-weight: bold">{{ item.username }}</div>
              <div class="user-info-bio" style="text-align: start;font-size: 14px;margin: 10px 0 0 0">{{ item.bio }}</div>
            </a-flex>
            <FollowButton :id="item.id" v-if="item.id !== selfId"/>
          </a-flex>

        </a-list-item>

      </template>
    </a-list>

    <a-empty v-if="dataList.length>0" style="margin-top: 20px">
      <template #description>
        <span>
          没有更多啦~
        </span>
      </template>
    </a-empty>

  </div>
</template>

<script>
import {useApp} from "@/useApp";
import dayjs from 'dayjs';
import followButton from "@/components/button/FollowButton.vue";
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  components: {followButton},
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    selfId:{
      type: Number,
      default: -1
    }
  },
  setup() {
    const {router,proxy} = useApp();

    const toUserHomePage = userId =>{
      if(userId){
        router.push('/user/'+userId);
      }else{
        proxy.$message.error("无法获取userid")
      }
    };

    return {
      toUserHomePage,
    };
  },
}
</script>

<style lang="less" scoped>

</style>