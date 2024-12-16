<template>
  <IndexHeader class="header"/>
  <a-row style="height: 1000px;">
    <a-col :span="16" :offset="4" style="height:140px;margin-top: 35px ">
      <a-flex justify="space-between" style="width: 100%;display:flex;background-color:white;">
        <a-flex>
          <a-avatar :size="88" :src="userData.profile_picture ? userData.profile_picture : require('@/assets/img/default_avatar.png')"
                    style="justify-self: start;margin: 20px 30px"/>

          <div class="user-info-right" style="margin: 30px 20px 0 0;">
            <div class="user-info-name" style="text-align: start;font-size: 20px;font-weight: bold">{{ userData.username }}</div>
            <div class="user-info-bio" style="text-align: start;font-size: 14px;margin: 10px 0 0 0">{{ userData.bio }}</div>
          </div>
        </a-flex>
        <a-flex :vertical="true" style="align-self: center">
          <a-button style="margin-right: 20px" v-if="!isSelf">关注</a-button>
          <a-button style="margin-right: 20px" v-if="isSelf" @click="toEditUserInfo">编辑个人资料</a-button>
          <a-button style="margin-right: 20px" @click="toEditUserInfo">*测试*：编辑个人资料</a-button>
        </a-flex>
      </a-flex>

      <div style="width: 100%;height: 300px;display:flex;background-color:white;margin-top: 30px">

      </div>

    </a-col>

  </a-row>
</template>

<script>
import {ref} from 'vue';
import userInfoService from "@/service/userInfoService";
import {useStore} from "vuex";
import {useRoute,useRouter} from 'vue-router';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
export default {
  components: {IndexHeader},
  setup(){
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const isSelf = ref(false);
    const userData = ref({
      id: "",
      userName: "用户名",
      email: "邮箱",
      profile_picture: null,
      bio: "个性签名",
    });
    const getCurrentUserInfo = () => {
      //Number(route.params.id)
      userInfoService.getOtherUserInfo(route.params.id)
          .then(res => {
            userData.value = res.data.data;
            console.log("初始获取用户信息：",userData);
            if(store.getters.getId === undefined || store.getters.getId === null){
              userInfoService.getUserInfo()
                  .then(res=>{
                    store.commit("setId",res.data.data.id);
                    if(userData.value.id === store.getters.getId){
                      isSelf.value = true;
                    }
                  })
                  .catch(err => {
                    console.log("获取用户信息错误: ", err);
                    //this.proxy.$message.error(err.desc);
                  })
            }else{
              if(userData.value.id === store.getters.getId){
                isSelf.value = true;
              }
            }
          })
          .catch(err => {
            console.log("获取用户信息错误: ", err);
          });
    };
    const toEditUserInfo = () =>{
      router.push('/settings');
    };
    return{
      userData,
      isSelf,
      getCurrentUserInfo,
      toEditUserInfo,
    };
  },
  mounted(){
    this.getCurrentUserInfo();
  }
};

</script>

<style lang="less">
.main-content{
  height: 1000px;
}

</style>