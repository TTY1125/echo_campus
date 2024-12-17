<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"
                 @refresh11="refresh2"/>

    <a-layout-content>
      <main class="main-content">
        <a-col :lg="{span:14,offset:2}" :xs="{span:20,offset:2}">
          <!-- 走马灯 -->
          <IndexCarousel style="margin-bottom: 10px" />
          <!-- 首页帖子 -->
          <IndexPosts :postsList="indexPostsList"/>
        </a-col>

        <a-col class="sider" :lg="{span:6}" :sm="{span:0}" :xs="{span:0}" style="border-left: 20px solid #f0f2f5">
          <div style="margin-bottom: 20px;height: 200px;  background-color: white;  align-content: center;justify-content: center;">
            <!-- <h3 style="font-size: 24px;font-weight: bold;">回声校园</h3> -->
            <img src="../../assets/img/logo1.png" alt="logo_img" style="height: 56px"/>
          </div>
          <!-- position: sticky; top:64px; -->
          <div style="margin-bottom: 20px;height: 400px;  background-color: white; text-align: start;  align-items: start;justify-items: start;">
            <span style="font-weight: bold"></span><br/>
            <span style="font-weight: bold"></span>
          </div>

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
  data(){
    return{
      indexPostsList: [],
    }
  },
  name: 'App',

  methods: {
    refresh2(){
      window.alert(2);
      location.reload();
    }
  }
}

</script>

<style lang="less" scoped>
#components-layout-basic .main-content {
  margin-top: 74px;
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
