<template>
  <a-comment>
    <template #avatar v-if="!comment_id&&!reply_id">
      <a-avatar :src="avatar"/>
    </template>
    <template #content>
      <a-form-item v-if="!comment_id&&!reply_id">
        <a-textarea v-model:value="commentValue" :rows="4" show-count :maxlength="200" placeholder="输入内容"/>
      </a-form-item>

      <a-form-item v-if="comment_id||reply_id">
        <a-textarea  v-model:value="commentValue" :rows="4" show-count :maxlength="200" style="margin: 4px 12px 0 0" placeholder="输入内容"/>
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
import { useApp } from '@/useApp';
import replyService from "@/service/replyService";  // 引入自定义的钩子

export default {
  props: {
    avatar: {
      default: () => null
    },
    post_id: {
      default: () => null
    },
    comment_id: {
      default: () => null
    },
    reply_id: {
      default: () => null
    },
  },
  setup(props){
    const { proxy,router } = useApp();
    const commentValue = ref('');
    const addComment = async (data) =>{
      try{
        await commentService.addComments(data);
        proxy.$message.success("发表成功");
        router.go(0);
      }catch(err){
        proxy.$message.error(err.desc);
      }
    }
    const addReply = async (data) =>{
      try{
        await replyService.addReply(data);
        proxy.$message.success("发表成功");
        router.go(0);
      }catch(err){
        proxy.$message.error(err.desc);
      }
    }

    const handleSubmit = async () =>{
      if(!commentValue.value){
        proxy.$message.error("评论不能为空！");
        return;
      }
      if(props.post_id && !props.comment_id && !props.reply_id){
        const data = {
          post_id: props.post_id,
          content: commentValue.value,
        };
        await addComment(data);
      }else if(props.post_id && props.comment_id && !props.reply_id){
        const data = {
          post_id: props.post_id,
          comment_id: props.comment_id,
          content: commentValue.value,
        };
        await addReply(data);
      }else if(props.post_id && props.comment_id && props.reply_id){
        const data = {
          post_id: props.post_id,
          comment_id: props.comment_id,
          reply_id: props.reply_id,
          content: commentValue.value,
        };
        await addReply(data);
      }else{
        proxy.$message.error("评论格式错误");
      }
    };

    return{
      commentValue,
      handleSubmit,
    }
  }

}


</script>

<style scoped lang="less">
.ant-form-item{
  margin-bottom: 14px;
}
:deep(.ant-comment-inner){
  padding: 0!important;
}
</style>