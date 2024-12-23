<template>
  <div>
    <!-- 登录按钮 -->
    <a-button type="primary" @click="showModal">登录</a-button>

    <!-- 登录弹窗 -->
    <a-modal
        v-model:open="isModalVisible"
        title="登录"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
      <!-- ref="loginForm"是用来给 <a-form> 组件设置一个引用名称 loginForm，通过这个引用可以访问到该表单的组件实例。从而可以调用loginForm.value.validate() -->
      <a-form
          ref="loginForm"
          :model="formValues"
          layout="vertical"
      >
        <!-- 用户名输入框 -->
        <a-form-item
            label="用户名"
            name="username"
            :rules="[
            { required: true, message: '请输入用户名' }
          ]"
        >
          <a-input v-model:value="formValues.username" placeholder="请输入用户名" />
        </a-form-item>

        <!-- 密码输入框 -->
        <a-form-item
            label="密码"
            name="password_hash"
            :rules="[
            { required: true, message: '请输入密码' }
          ]"
        >
          <a-input-password v-model:value="formValues.password_hash" placeholder="请输入密码" />
        </a-form-item>

        <IndexRegister/>

      </a-form>
    </a-modal>
  </div>
</template>

<script>
import loginService from "@/service/loginService";
import IndexRegister from "@/components/index/header/IndexRegister.vue"
import { ref } from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getCurrentInstance} from 'vue';
import userInfoService from "@/service/userInfoService";

export default {
  components: {IndexRegister},
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();//用于获取 Vuex 实例，它在 setup 中替代了 this.$store
    const router = useRouter();

    // 弹窗状态
    const isModalVisible = ref(false);
    // 登录表单
    const loginForm = ref(null);
    const formValues = ref({
      username: "",
      password_hash: "",
    });

    // 显示弹窗
    const showModal = () => {
      isModalVisible.value = true;
    };

    // 关闭弹窗
    const handleCancel = () => {
      isModalVisible.value = false;
    };

    // 提交表单
    const handleSubmit = async () => {
      if (loginForm.value) {
        loginForm.value
            .validate()//验证rules规则
            .then(async () => {
              try{
                console.log("表单提交数据: ", formValues.value);
                const res = await loginService.login(formValues.value);
                if(res.data.code===0){
                  console.log("登录成功: ", res);
                  store.commit('loginSuccess');// 通过 mutation 更新 isLogin
                  await store.dispatch('setToken', res.data.data);// 通过 action 更新 token
                  const infoRes = await userInfoService.getUserInfo();
                  store.commit("setId",infoRes.data.data.id);//更新用户id
                  // 刷新当前页面
                  router.go(0);
                  isModalVisible.value = false;
                }else{
                  console.log("登录失败: ", res);
                  proxy.$message.error("登录失败: ",res.data.message);
                }
              }catch(e) {
                console.log("登录错误: ", e);
                proxy.$message.error("登录错误: ",e.desc);
              }
            })
            .catch(error => {
              console.log("表单校验失败: ", error);
            });
      }
    };

    return {
      isModalVisible,
      loginForm,
      formValues,
      showModal,
      handleCancel,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
/* 样式可根据需要调整 */
</style>
