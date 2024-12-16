<template>
  <a-flex align="center">
    <a-input class="write-item" v-model:value="title" placeholder="输入文章标题" size="large"/>
    <a-button type="primary" @click="submit">发布文章</a-button>
  </a-flex>

  <div style="height: 92%;width: 100%">
    <mavon-editor
        ref=md
        v-model="content_md"
        @change="markdownChange"
        style="z-index: 0"/>
  </div>

</template>

<script>
import {getCurrentInstance, ref} from 'vue';
import articleService from "@/service/articleService";
export default {
  setup(){
    const { proxy } = getCurrentInstance();
    const md = ref(null);
    const title = ref('');
    const content_md = ref('');
    const content_html = ref('');
    const markdownChange = () =>{
      content_html.value = md.value.d_render;
      console.log("content",content_md);
      console.log("drender",md.value.d_render);
    };
    const submit = () =>{
      if(!title.value){
        proxy.$message.error("标题不能为空！");
      }else if(!content_html.value){
        proxy.$message.error("内容不能为空！");
      }else{
        let post = {
          title:title.value,
          content:content_html.value,
        }
        articleService.uploadArticle(post);
      }
    };
    return{
      md,
      title,
      content_md,
      markdownChange,
      submit,
    };
  },

}

</script>

<style scoped lang="less">

</style>