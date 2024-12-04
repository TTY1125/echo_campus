<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" :data-source="postsListShow">
      <template #renderItem = "{ item }"><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
        <a-list-item style="background-color: white;">
          <a-flex  style="caret-color: transparent;margin: 6px 0 6px 0">
            <div class="index-post-pic" style="height: 130px;width: 180px;flex-shrink: 0;margin-right: 12px;"><!-- 一定要加上flex-shrink呀！ -->
              <img :src="item.imgSrc" style="height: 135px;width: 180px;object-fit: cover;" alt="index_post_img" />
            </div>

            <a-col class="index-post-right">
              <div class="index-post-title">{{ item.title }}</div>
              <div class="index-post-content">{{ item.content }}</div>
              <a-row class="index-post-extra" style="align-self: flex-end;color: rgba(0,0,0,0.7);align-items: end">
                <EyeOutlined style="margin-right: 6px;font-size: 20px;"/>
                <span style="line-height: 20px;margin-right: 10px">65</span>
                <LikeOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 10px">88</span>
                <MessageOutlined style="margin-right: 6px;font-size: 20px"/>
                <span style="line-height: 20px;margin-right: 15px;">27</span>
                <a-avatar src="./assets/img/logo.png"/>
                <span>回声campus</span>
                <span style="margin-left: 15px;color: rgba(0,0,0,0.7)">1月前</span>
              </a-row>
            </a-col>

          </a-flex>
        </a-list-item>

      </template>

    </a-list>
  </div>
</template>

<script>
import { EyeOutlined,LikeOutlined,MessageOutlined } from '@ant-design/icons-vue';
export default {
  props: {
    postsList: {type: Array, default: () => []},
  },
  data(){
    const data = [
      {
        title: '数据分析：探索数据背后的秘密与挑战',
        content: '数据分析是一项复杂而富有挑战性的工作，它要求分析师具备扎实的统计学基础、熟练的数据处理技能、敏锐的业务洞察力以及良好的沟通协调能力。面对上述重难点，持续学习、实践和创新是提升数据分析能力的不二法门。随着技术的不断进步和应用的深化，数据分析将继续在推动社会经济发展中发挥重要作用，而克服这些挑战，将使我们更好地挖掘数据的潜力，创造更大的价值。',
        imgSrc: require('@/assets/img/bigdata.png'),
      },
      {
        title: 'Ant Design Title 2',
        imgSrc: require('@/assets/img/logo.png'),
      },
      {
        title: 'Ant Design Title 3',
        imgSrc: require('@/assets/img/logo.png'),
      },
      {
        title: 'Ant Design Title 4',
        imgSrc: require('@/assets/img/logo.png'),
      },
      {
        title: 'Ant Design Title 5',
        imgSrc: require('@/assets/img/logo.png'),
      },
      {
        title: 'Ant Design Title 6',
        imgSrc: require('@/assets/img/logo.png'),
      },
    ];
    return{
      //postsListShow: this.postsList,
      postsListShow: data,
    };
  },
  components: {
    EyeOutlined,LikeOutlined,MessageOutlined
  },
  name: 'IndexPosts',
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
</style>