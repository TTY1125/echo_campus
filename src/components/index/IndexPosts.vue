<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" :data-source="data">
      <template #renderItem><!-- a-list-item传入#renderitem，子组件（插槽）的item传入父组件 -->
        <a-list-item style="background-color: white;">
          <a-flex  style="caret-color: transparent;">
            <a-col class="index-post-pic" style="height: 135px;width: 180px;margin-right: 12px">
              <img src="@/assets/logo.png" style="height: 100%;" alt="index_post_img" />
            </a-col>

            <a-col class="index-post-content" style="height: 135px;">
              <a-row class="title">
                <span style="font-size: 24px;font-weight: bold">标题</span>
              </a-row>
              <a-row class="title" style="margin-bottom: 10px">
                <span style="font-size: 18px;text-align: start">正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文正文</span>
              </a-row>
              <a-row class="title">
                <EyeOutlined style="margin-right: 6px;font-size: 20px;"/>
                  <span style="line-height: 20px;margin-right: 10px">65</span>
                <LikeOutlined style="margin-right: 6px;font-size: 20px"/>
                  <span style="line-height: 20px;margin-right: 10px">88</span>
                <MessageOutlined style="margin-right: 6px;font-size: 20px"/>
                  <span style="line-height: 20px;margin-right: 10px">27</span>
                <span>作者：[头像]作者名 1年前</span>
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
  data(){
    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
      {
        title: 'Ant Design Title 5',
      },
      {
        title: 'Ant Design Title 6',
      },
    ];
    return{
      data,
    };
  },
  components: {
    EyeOutlined,LikeOutlined,MessageOutlined
  },
  name: 'IndexPosts',
}
</script>

<style>

</style>