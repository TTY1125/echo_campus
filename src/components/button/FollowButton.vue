<template>
  <!-- 是否显示（isSelf）的逻辑放父组件，关注和已关注的切换在本文件 -->
  <a-button style="margin-right: 20px" v-if="!isFollow" @click="follow">关注</a-button>
  <a-button style="margin-right: 20px;color: rgb(0,0,0,0.5)" v-if="isFollow" @click="notFollow">已关注</a-button>
</template>

<script>

import likeFavFowService from "@/service/likeFavFowService";
import {ref} from "vue";
import {useApp} from "@/useApp";

export default {
  props: {
    id: {//被关注者的id
      type: Number,
      default: () => -1
    }
  },
  setup(props) {
    const {proxy} = useApp();
    const isFollow = ref(false);//是否已经关注
    const follow = async () =>{
      try {
        await likeFavFowService.follow(props.id);
        proxy.$message.success("关注成功");
        isFollow.value = true;
      }catch (e) {
        proxy.$message.error("关注失败");
      }
    };
    const notFollow = async () =>{
      try {
        await likeFavFowService.notFollow(props.id);
        proxy.$message.success("取消关注成功");
        isFollow.value = false;
      }catch (e) {
        proxy.$message.error("取消关注失败");
      }
    };
    const getIfIsFollow = async () =>{
      try {
        const res = await likeFavFowService.getIfMyFollow(props.id);
        isFollow.value = res.data.data;//???
      }catch (e) {
        proxy.$message.error("获取是否关注失败");
      }
    };
    return {
      isFollow,
      follow,
      notFollow,
      getIfIsFollow,
    }
  },
  mounted() {
    this.getIfIsFollow();
  }
}

</script>

<style scoped lang="less">

</style>