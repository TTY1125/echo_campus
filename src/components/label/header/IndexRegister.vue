<template>
  <div>
    没有账号？
    <a @click="showRegModal">
      点击注册！
    </a>

    <!-- 登录弹窗 -->
    <a-modal
        v-model:open="isRegModalVisible"
        title="注册"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
      <!-- ref="loginForm"是用来给 <a-form> 组件设置一个引用名称 loginForm，通过这个引用可以访问到该表单的组件实例。从而可以调用loginForm.value.validate() -->
      <a-form
          ref="regForm"
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

        <!-- 确认密码 -->
        <a-form-item
            label="确认密码"
            name="password_check"
            :rules="[
            { required: true, message: '请确认密码' },
            { validator: validatePass }
          ]"
        >
          <a-input-password v-model:value="formValues.password_check" placeholder="请再次输入密码" />
        </a-form-item>

        <!-- 邮箱输入框 -->
        <a-form-item
            label="邮箱"
            name="email"
            :rules="[
            { required: true, message: '请输入邮箱' }
          ]"
        >
          <a-input type:email v-model:value="formValues.email" placeholder="请输入邮箱" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script>
import {getCurrentInstance, ref} from "vue";
import loginService from "@/service/loginService";
//import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    //const store = useStore();//用于获取 Vuex 实例，它在 setup 中替代了 this.$store
    const router = useRouter();
    // 弹窗状态
    const isRegModalVisible = ref(false);
    // 登录表单
    const regForm = ref(null);
    const formValues = ref({
      username: "",
      password_hash: "",
      password_check: "",
      email: "",
    });

    // 显示弹窗
    const showRegModal = () => {
      isRegModalVisible.value = true;
    };
    const handleCancel = () => {
      isRegModalVisible.value = false;
    };
    const validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('请再次输入密码');
      } else if (value !== formValues.value.password_hash) {
        return Promise.reject("两次密码不一致！");
      } else {
        return Promise.resolve();
      }
    };
    // 提交表单
    const handleSubmit = async () => {
      if (regForm.value) {
        regForm.value
            .validate()//验证rules规则
            .then(() => {
              console.log("表单提交数据: ", formValues.value);
              loginService.register(formValues.value)
                  .then(res => {
                    if(res.data.code===0){
                      console.log("注册成功: ", res);
                      // 刷新当前页面
                      router.go(0);
                      isRegModalVisible.value = false;
                    }else{
                      console.log("注册失败: ", res);
                      proxy.$message.error(res.data.message);
                    }

                  })
                  .catch(err => {
                    console.log("注册错误: ", err);
                    proxy.$message.error(err.desc);
                  });


            })
            .catch(error => {
              console.log("表单校验失败: ", error);
            });
      }
    };
    return{
      isRegModalVisible,
      regForm,
      formValues,
      validatePass,
      showRegModal,
      handleCancel,
      handleSubmit,
    }
  }
}
</script>

<style scoped lang="less">

</style>