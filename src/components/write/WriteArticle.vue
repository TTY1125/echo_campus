<template>
  <a-flex align="center">
    <a-input class="write-item" v-model:value="title" placeholder="输入文章标题" size="large"/>
    <a-button type="primary" @click="submit">发布文章</a-button>
  </a-flex>

  <div style="height: 92%;width: 100%">
    <mavon-editor
        ref=md
        v-model="content_md"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        @change="markdownChange"
        style="z-index: 0"/>
  </div>

</template>

<script>
import {getCurrentInstance, ref} from 'vue';
import articleService from "@/service/articleService";
import router from "@/router";
export default {
  setup(){
    const { proxy } = getCurrentInstance();
    const md = ref(null);
    const title = ref('');
    const content_md = ref('');
    const content_html = ref('');
    const img_file = ref({});
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
        // 第一步.将图片上传到服务器.
        const formData = new FormData();
        for(let img in img_file.value){
          formData.append(img, img_file.value[img]);
        }
        articleService.submitPostPic(formData)
            .then(res=>{
              for (let resImg in res.data.data) {
                try {
                  console.log("url替换",res.data.data[resImg].pos, res.data.data[resImg].url);
                  md.value.$img2Url(res.data.data[resImg].pos, res.data.data[resImg].url);
                }catch (err) {
                  console.log("url替换错误",err);
                }
              }
              console.log("图片上传结果",res);
              console.log("图片上传url",md.value.d_render);

              content_html.value = md.value.d_render;
              let post = {
                title:title.value,
                content:content_html.value,
              }
              articleService.uploadArticle(post)
                  .then(()=>{
                    proxy.$message.success("文章发布成功");
                    router.push('/');
                  })
                  .catch(err=>{
                    proxy.$message.error(err.desc);
                  })

            })
            .catch(err=>{
              proxy.$message.error(err.desc);
            });

      }
    };
    const imgAdd = async (pos, file) =>{
      // 校验图片大小（不能超过5M）
      if (file.size > 5 * 1024 * 1024) {
        this.$message.warning("图片大小过大！不得大于5MB");
      }else{
        img_file.value[pos] = file;
      }
    };

    const imgDel = async (pos) =>{
      delete img_file.value[pos];
    };

    return{
      md,
      title,
      content_md,
      markdownChange,
      submit,
      imgAdd,
      imgDel,
    };
  },

}

</script>

<style scoped lang="less">

</style>