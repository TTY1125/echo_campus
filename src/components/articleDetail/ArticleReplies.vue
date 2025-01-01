<template>
  <addComment v-if="addReplyIsShown" :avatar="avatar" :post_id="postId" :comment_id="commentId" style="background-color: #f7f8fa"/>
  <div v-if="replyList.length>0" style="background-color: #f7f8fa">

    <a-list
        class="reply-list"
        item-layout="horizontal"
        :data-source="replyList"
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
                <div class="button-item" style="cursor: pointer;" @click="likeReply(item.id)">
                  <LikeOutlined v-if="!item.replyIsLiked"/>
                  <LikeFilled v-if="item.replyIsLiked"/>
                  <span style="margin-left: 4px;">{{item.replyLikeNum}}</span>
                </div>

                <div class="button-item" style="cursor: pointer;margin:0 4px;" @click="showAddComment(item.id)">
                  <MessageOutlined style="margin:0 4px;"/>
                </div>

                <div class="button-item" v-if="item.user_id === userId" style="cursor: pointer;margin-left: 10px" @click="deleteReply(item.id)">
                  <DeleteOutlined />
                </div>
              </a-flex>

              <addComment v-if="item.addReplyIsShown" :avatar="avatar" :post_id="postId" :comment_id="commentId" :reply_id="item.id" style="background-color: #f7f8fa"/>

            </template>
            <template #datetime>
              <a-tooltip :title="item.created_at.format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ item.created_at.fromNow() }}</span>
              </a-tooltip>
            </template>
          </a-comment>

        </a-list-item>

      </template>
    </a-list>
  </div>
</template>

<script>

import {defineComponent, reactive, createVNode, ref, watch} from "vue";
import { Modal } from 'ant-design-vue';
import {
  DeleteOutlined,
  LikeFilled,
  LikeOutlined,
  ExclamationCircleOutlined,
  MessageOutlined
} from "@ant-design/icons-vue";
import addComment from "@/components/articleDetail/AddComments.vue";
import replyService from "@/service/replyService";
import dayjs from "dayjs";
import userInfoService from "@/service/userInfoService";
import likeFavFowService from "@/service/likeFavFowService";
import {useApp} from "@/useApp";

export default defineComponent({
  components: {MessageOutlined, addComment, LikeOutlined, LikeFilled, DeleteOutlined},
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
    commentId: {
      default: () => null
    },
    addReplyIsShown: {
      default: () => false
    },
    replyNum: Number
  },
  setup(props, { emit }){
    const { route, proxy, router } = useApp();
    const replyList = reactive([]);
    const replyNumRef = ref(props.replyNum);

    watch(replyNumRef, (newValue) => {
      emit('update:replyNum', newValue);
    });

    const getCurrentReplies = async () =>{
      try{
        let repliesRes = await replyService.getReplies(0,props.commentId,route.params.id);
        let ret = repliesRes.data.data;
        replyNumRef.value = ret.length;
        for(let i in ret){
          let currReply = {
            id: ret[i].id,
            user_id: ret[i].user_id,
            content: ret[i].content,
            created_at: dayjs(ret[i].created_at),
            userName: null,
            avatar: null,
            replyIsLiked: false,
            replyLikeNum: 0,
          };
          //用户信息
          let userRes = await userInfoService.getOtherUserInfo(currReply.user_id);
          currReply.userName = userRes.data.data.username;
          currReply.avatar = userRes.data.data.profile_picture;
          //点赞
          let isMyLike = await likeFavFowService.getIfMyLike(props.postId,'',currReply.id);
          currReply.replyIsLiked = isMyLike.data.data===1;
          let postLikeNumRes = await likeFavFowService.getLikeNum(props.postId,'',currReply.id);
          currReply.replyLikeNum = postLikeNumRes.data.data;
          replyList.push(currReply);
        }
      }catch (e) {
        proxy.$message.error("获取回复失败");
        console.log("获取回复失败",e.desc);
      }
    };
    const likeReply = async (replyId)=>{
      try{
        let data = {post_id:props.postId,reply_id:replyId};
        const item = replyList.find(item => item.id === replyId);
        if(!item.replyIsLiked){//点赞
          await likeFavFowService.like(data);
          item.replyIsLiked = true;
        }else{//取消点赞
          await likeFavFowService.notLike(data);
          item.replyIsLiked = false;
        }
        let postLikeNumRes = await likeFavFowService.getLikeNum(props.postId,'',replyId);
        item.replyLikeNum = postLikeNumRes.data.data;
      }catch (e) {
        proxy.$message.error("点赞处理失败");
        console.log("点赞处理失败",e);
      }
    };

    const deleteReply = async (replyId)=>{
      Modal.confirm({
        title: '确定删除这条回复吗?',
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
            await replyService.deleteReply(props.postId,replyId);
            proxy.$message.success("删除回复成功");
            router.go(0);
          }catch (e) {
            proxy.$message.error("删除回复失败");
            console.log("删除回复失败",e);
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
    };

    const showAddComment = commentId =>{
      const item = replyList.find(item => item.id === commentId);
      item.addReplyIsShown = !item.addReplyIsShown;
    };

    return{
      replyList,
      getCurrentReplies,
      likeReply,
      deleteReply,
      toUserHomePage,
      showAddComment,
    }
  },
  mounted() {
    this.getCurrentReplies();
  }
})
</script>

<style scoped lang="less">
:deep(.button-item:hover){
  color: #1677FF;
}
:deep(.ant-list-item){
  border-block-end-color: transparent;
}
</style>