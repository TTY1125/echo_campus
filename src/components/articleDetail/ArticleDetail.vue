<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="main-content" style="display: flex;">
        <a-col :lg="{span:14,offset:2}" :xs="{span:20,offset:2}">

          <div class="article-content" style="width: 100%" v-if="content">
            <mavon-editor
                v-model="content"
                :subfield="false"
                defaultOpen="preview"
                :toolbarsFlag="false"
                boxShadowStyle="0"
                previewBackground="#fff"
                codeStyle="obsidian"
                :xssOptions=false></mavon-editor>
          </div>

        </a-col>

        <!-- 侧栏 -->
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
//import {useStore} from "vuex";
import {useRoute} from 'vue-router';
import articleService from "@/service/articleService";
import {getCurrentInstance, ref} from "vue";
import IndexHeader from "@/components/index/header/IndexHeader.vue";

export default {
  components: {IndexHeader},
  setup(){
    const route = useRoute();
    const title = ref('');
    const content = ref('');
    const { proxy } = getCurrentInstance();
    const gerCurrentArticle = () =>{
      articleService.getArticleById(route.params.id)
          .then(res=>{
            title.value = res.data.data.title;
            content.value = res.data.data.content;
          })
          .catch(err=>{
            proxy.$message.error("获取文章内容失败");
            console.log("获取文章内容失败",err);
          })
    }
    return{
      title,
      content,
      gerCurrentArticle,
    }
  },
  mounted() {
    this.gerCurrentArticle();
  }
};
</script>

<style scoped lang="less">

</style>