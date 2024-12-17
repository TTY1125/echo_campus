<template>
  <a-comment>
    <template #avatar>
      <a-avatar :src="avatar" alt="Han Solo" />
    </template>
    <template #content>
      <a-form-item>
        <a-textarea v-model:value="commentValue" :rows="4" show-count :maxlength="200"/>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" type="primary" @click="handleSubmit">
          发表评论
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>

<script>
import commentService from "@/service/commentService";
import {ref} from "vue";
import { useApp } from '@/useApp';  // 引入自定义的钩子

export default {
  props: {
    avatar: {
      default: () => null
    },
    post_id: {
      default: () => null
    },
  },
  setup(props){
    const { proxy,router } = useApp();
    const commentValue = ref('');
    const handleSubmit = () =>{
      if(!commentValue.value){
        proxy.$message.error("评论不能为空！");
        return;
      }
      const data = {
        post_id: props.post_id,
        content: commentValue.value,
      };
      commentService.addComments(data)
          .then(()=>{
            proxy.$message.info("发表成功");
            router.go(0);
          })
          .catch(err=>{
            proxy.$message.error(err.desc);
          })
    }

    return{
      commentValue,
      handleSubmit,
    }
  }

}


</script>

<style scoped lang="less">
.ant-form-item.css-dev-only-do-not-override-17yhhjv{
  margin-bottom: 14px;
}
</style>