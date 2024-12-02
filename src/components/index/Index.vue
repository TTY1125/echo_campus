<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="content">
        <a-col span=14 offset=2 style="border-right: 20px solid #f0f2f5">
          <!-- 走马灯 -->
          <IndexCarousel style="margin-bottom: 10px" />
          <!-- 首页帖子 -->
          <IndexPosts/>

        </a-col>

        <a-col span=6>
            <a-row class="sider">
              <!-- <h3 style="font-size: 24px;font-weight: bold;">回声校园</h3> -->
              <img src="@/assets/logo1.png" style="height: 56px"/>
            </a-row>
        </a-col>

      </main>
    </a-layout-content>

  </a-layout>
</template>


<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import IndexCarousel from "@/components/index/IndexCarousel.vue";
import IndexPosts from "@/components/index/IndexPosts.vue";
export default {
  components:{
    IndexCarousel,
    IndexHeader,
    IndexPosts,
  },
  name: 'App',
}

</script>

<style lang="less" scoped>
#components-layout-basic .header {
  position: fixed;
  z-index: 999;
  width: 100%;
  background: #f0f2f5;
  border-bottom: 1px solid #00000021;
}

#components-layout-basic .content {
  margin-top: 64px;
  width: 100%;
  display:flex;
  background-color: #f0f2f5;
  //background-image:url('@/assets/back1.png');
  background-size: 200px 200px;
  background-repeat:repeat;
}

#components-layout-basic .sider {
  width:100%;
  height:200px;
  background-color: white;
  align-content: center;
  position: sticky;
  top:64px;
  z-index: 900;
  justify-content: center;
}

</style>
