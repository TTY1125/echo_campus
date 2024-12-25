<template>
  <div><!-- 用div来获取父组件的样式 -->
    <!-- 是否显示（isSelf）的逻辑放父组件，关注和已关注的切换在本文件 -->
    <a-button v-if="!isFollow" @click.stop="follow">关注</a-button>
    <a-button style="color: rgb(0,0,0,0.5)" v-if="isFollow" @click.stop="notFollow">已关注</a-button>
  </div>
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
        let data = {followed_id:props.id};
        await likeFavFowService.follow(data);
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
      if(props.id!==-1){
        try {
          const res = await likeFavFowService.getIfMyFollow(props.id);
          isFollow.value = res.data.data===1;
        }catch (e) {
          proxy.$message.error("获取是否关注失败");
        }
      }
    };
    return {
      isFollow,
      follow,
      notFollow,
      getIfIsFollow,
    }
  },
  async mounted() {
    await this.getIfIsFollow();
  }
}

</script>

<style scoped lang="less">

</style>