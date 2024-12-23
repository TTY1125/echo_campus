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
                <EyeOutlined style="margin-right: 6px;font-size: 20px;"/>
                <span style="line-height: 20px;margin-right: 10px">{{ item.lookNum }}</span>
                <LikeOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 10px">{{ item.likeNum }}</span>
                <MessageOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 15px;">{{ item.commentNum }}</span>
                <a-avatar :src="item.avatar" @click.stop="toUserHomePage(item.user_id)" :size="30"/>
                <span style="margin-left: 4px">{{ item.userName }}</span>

                <a-tooltip :title="item.created_at.format('YYYY-MM-DD HH:mm:ss')">
                  <span style="margin-left: 15px;color: rgba(0,0,0,0.7)">{{ item.created_at.fromNow() }}</span>
                </a-tooltip>

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
import { EyeOutlined,LikeOutlined,MessageOutlined } from '@ant-design/icons-vue';
import {useApp} from "@/useApp";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

export default {
  components: {
    EyeOutlined,
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

    // const postsListShow = ref([
    //   {
    //     id: 114514,
    //     title: '数据分析：探索数据背后的秘密与挑战',
    //     content: '数据分析是一项复杂而富有挑战性的工作，它要求分析师具备扎实的统计学基础、熟练的数据处理技能、敏锐的业务洞察力以及良好的沟通协调能力。面对上述重难点，持续学习、实践和创新是提升数据分析能力的不二法门。随着技术的不断进步和应用的深化，数据分析将继续在推动社会经济发展中发挥重要作用，而克服这些挑战，将使我们更好地挖掘数据的潜力，创造更大的价值。',
    //     imgSrc: require('@/assets/img/bigdata.png')
    //   },
    //   {
    //     id: 114514,
    //     title: '数据分析：探索数据背后的秘密与挑战',
    //     content: '数据分析是一项复杂而富有挑战性的工作，它要求分析师具备扎实的统计学基础、熟练的数据处理技能、敏锐的业务洞察力以及良好的沟通协调能力。面对上述重难点，持续学习、实践和创新是提升数据分析能力的不二法门。随着技术的不断进步和应用的深化，数据分析将继续在推动社会经济发展中发挥重要作用，而克服这些挑战，将使我们更好地挖掘数据的潜力，创造更大的价值。',
    //     imgSrc: require('@/assets/img/bigdata.png')
    //   },
    //   {
    //     id: 114514,
    //     title: '数据分析：探索数据背后的秘密与挑战',
    //     content: '数据分析是一项复杂而富有挑战性的工作，它要求分析师具备扎实的统计学基础、熟练的数据处理技能、敏锐的业务洞察力以及良好的沟通协调能力。面对上述重难点，持续学习、实践和创新是提升数据分析能力的不二法门。随着技术的不断进步和应用的深化，数据分析将继续在推动社会经济发展中发挥重要作用，而克服这些挑战，将使我们更好地挖掘数据的潜力，创造更大的价值。',
    //     imgSrc: require('@/assets/img/bigdata.png')
    //   },
    //   {
    //     id: 114514,
    //     title: '数据分析：探索数据背后的秘密与挑战',
    //     content: '数据分析是一项复杂而富有挑战性的工作，它要求分析师具备扎实的统计学基础、熟练的数据处理技能、敏锐的业务洞察力以及良好的沟通协调能力。面对上述重难点，持续学习、实践和创新是提升数据分析能力的不二法门。随着技术的不断进步和应用的深化，数据分析将继续在推动社会经济发展中发挥重要作用，而克服这些挑战，将使我们更好地挖掘数据的潜力，创造更大的价值。',
    //     imgSrc: require('@/assets/img/bigdata.png')
    //   },
    // ]);

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
</style>