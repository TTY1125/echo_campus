<template>
  <span style="font-weight: bold;font-size: 18px;display: flex;">评论</span>

  <addComment :avatar="avatar" :post_id="postId" style="margin-top: 20px"/>

  <a-list
      class="comment-list"
      :header="`全部评论 ${commentList.length}`"
      item-layout="horizontal"
      :data-source="commentList"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-comment>
          <template #author>
              <a @click="toUserHomePage(item.user_id)">{{item.userName}}</a>
              <a @click="toUserHomePage(item.user_id)" v-if="item.user_id===userId">(我)</a>
              <a @click="toUserHomePage(item.user_id)" v-if="item.user_id===postAuthorId">(楼主)</a>
          </template>
          <template #avatar>
            <a-avatar :src="item.avatar" @click="toUserHomePage(item.user_id)"/>
          </template>
          <template #content>
            <p style="margin-bottom: 4px">
              {{ item.content }}
            </p>

            <!-- 评论操作 -->
            <a-flex style="caret-color: transparent">
              <div class="button-item" style="cursor: pointer;margin:0 4px 0 0;" @click="likeComment(item.id)">
                <LikeOutlined v-if="!item.commentIsLiked" style="margin:0 4px;"/>
                <LikeFilled v-if="item.commentIsLiked" style="margin:0 4px;"/>
                <span style="margin:0 4px;">{{item.commentLikeNum}}</span>
              </div>

              <div class="button-item" style="cursor: pointer;margin:0 4px;" @click="showAddComment(item.id)">
                <MessageOutlined style="margin:0 4px;"/>
                <span style="margin:0 4px;">{{item.replyNum}}</span>
              </div>

              <div class="button-item" v-if="item.user_id === userId" style="cursor: pointer;margin-left: 4px" @click="deleteComment(item.id)">
                <DeleteOutlined />
              </div>
            </a-flex>

          </template>
          <template #datetime>
            <a-tooltip :title="item.created_at.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{ item.created_at.fromNow() }}</span>
            </a-tooltip>
          </template>

          <article-replies :avatar="avatar" :postId="postId" :postAuthorId="postAuthorId" :userId="userId"
                           :comment-id="item.id" v-model:addReplyIsShown="item.addReplyIsShown" v-model:replyNum="item.replyNum"
                           style="background-color: #f0f2f5"/>

        </a-comment>

      </a-list-item>

    </template>
  </a-list>
</template>

<script>

import {defineComponent, reactive, createVNode} from "vue";
import { Modal } from 'ant-design-vue';
import {DeleteOutlined, LikeFilled, LikeOutlined, ExclamationCircleOutlined, MessageOutlined} from "@ant-design/icons-vue";
import addComment from "@/components/articleDetail/AddComments.vue";
import articleReplies from "@/components/articleDetail/ArticleReplies.vue";
import commentService from "@/service/commentService";
import dayjs from "dayjs";
import userInfoService from "@/service/userInfoService";
import likeFavFowService from "@/service/likeFavFowService";
import {useApp} from "@/useApp";

export default defineComponent({
  components: {addComment, LikeOutlined, LikeFilled, DeleteOutlined, articleReplies, MessageOutlined},
  props: {
    avatar: {
      default: () => null
    },
    postId: {
      default: () => null
    },
    postAuthorId: {
      default: () => null
    },
    userId: {
      default: () => null
    },
  },
  setup(props){
    const { route, proxy, router} = useApp();
    const commentList = reactive([]);

    const getCurrentComments = async () =>{
      // if(route.params.id === '114514'){
      //   commentList.value = [
      //     {
      //       id: 1,
      //       user_id: 1,
      //       content: '一条测试评论',
      //       created_at: dayjs('2024-12-10 14:30:00'),
      //     },
      //   ]
      // }
      try{
        let commentsRes = await commentService.getComments(0,route.params.id);
        let ret = commentsRes.data.data;
        for(let i in ret){
          let currComment = {
            id: ret[i].id,
            user_id: ret[i].user_id,
            content: ret[i].content,
            created_at: dayjs(ret[i].created_at),
            userName: null,
            avatar: null,
            commentIsLiked: false,
            commentLikeNum: 0,
            addReplyIsShown: false,
            replyNum: 0,
          };
          let userRes = await userInfoService.getOtherUserInfo(currComment.user_id);
          currComment.userName = userRes.data.data.username;
          currComment.avatar = userRes.data.data.profile_picture;
          //点赞
          let isMyLike = await likeFavFowService.getIfMyLike(props.postId,currComment.id,'');
          currComment.commentIsLiked = isMyLike.data.data===1;
          let postLikeNumRes = await likeFavFowService.getLikeNum(props.postId,currComment.id,'');
          currComment.commentLikeNum = postLikeNumRes.data.data;
          commentList.push(currComment);
        }
      }catch (e) {
        proxy.$message.error("获取评论失败");
        console.log("获取评论失败",e.desc);
      }
    };
    const likeComment = async (commentId)=>{
      try{
        let data = {post_id:props.postId,comment_id:commentId};
        const item = commentList.find(item => item.id === commentId);
        if(!item.commentIsLiked){//点赞
          await likeFavFowService.like(data);
          item.commentIsLiked = true;
        }else{//取消点赞
          await likeFavFowService.notLike(data);
          item.commentIsLiked = false;
        }
        let postLikeNumRes = await likeFavFowService.getLikeNum(props.postId,commentId,'');
        item.commentLikeNum = postLikeNumRes.data.data;
      }catch (e) {
        proxy.$message.error("点赞处理失败");
        console.log("点赞处理失败",e);
      }
    };

    const deleteComment = async (commentId)=>{

      Modal.confirm({
        title: '确定删除这条评论吗?',
        icon: createVNode(ExclamationCircleOutlined),
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        content: createVNode(
            'div',
            {
              style: 'color:red;',
            },
            '此操作无法回退！',
        ),
        async onOk() {
          try{
            await commentService.deleteComments(props.postId,commentId);
            proxy.$message.success("删除评论成功");
            router.go(0);
          }catch (e) {
            proxy.$message.error("删除评论失败");
            console.log("删除评论失败",e);
          }
        },
      });

    };

    const toUserHomePage = userId =>{
      if(userId){
        router.push('/user/'+userId);
      }else{
        proxy.$message.error("无法获取userid")
      }
    }

    const showAddComment = commentId =>{
      const item = commentList.find(item => item.id === commentId);
      item.addReplyIsShown = !item.addReplyIsShown;
    }

    return{
      commentList,
      getCurrentComments,
      likeComment,
      deleteComment,
      toUserHomePage,
      showAddComment,
    }
  },
  mounted() {
    this.getCurrentComments();
  }
})
</script>

<style scoped lang="less">
:deep(.button-item:hover){
  color: #1677FF;
}
:deep(.ant-comment){
  width: 100%;
}
:deep(.ant-comment-inner){
  padding: 0!important;
}
</style>