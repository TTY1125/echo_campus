<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-row style="height: 1000px;">
      <a-col :span="16" :offset="4" style="height:140px;margin-top: 35px ">
        <a-layout-content class="main-content">

          <a-layout style="padding: 24px 0; background: #fff">
            <a-layout-sider width="185" style="background: #fff">
              <a-menu
                  v-model:selectedKeys="selectedKeys"
                  mode="inline"
                  style="height: 100%"
              >
                <a-menu-item key="editInfo">
                <span>
                  编辑个人资料
                </span>
                </a-menu-item>
                <a-divider style="margin:5px 0 5px 0;"/>
                <a-menu-item key="uploadAvatar">
                <span>
                  上传头像
                </span>
                </a-menu-item>
                <a-divider style="margin:5px 0 5px 0;"/>
                <a-menu-item key="accountSettings">
                <span>
                  账号设置
                </span>
                </a-menu-item>
              </a-menu>
            </a-layout-sider>

            <!-- 内容 -->
            <a-layout-content style="margin:0 40px 0 40px;">

              <a-form
                  ref="editForm"
                  :model="formValues"
                  layout="vertical"
                  v-if="selectedKeys.includes('editInfo')">

                <!-- 用户名输入框 -->
                <a-form-item
                    label="用户名"
                    name="username"
                    :rules="[
                      { required: true, message: '请输入用户名' }]">
                  <a-input v-model:value="formValues.username" placeholder="请输入用户名" />
                </a-form-item>

                <!-- 密码输入框 -->
                <a-form-item
                    label="密码"
                    name="password_hash"
                    :rules="[
                      { required: true, message: '请输入密码' }]">
                  <a-input-password v-model:value="formValues.password_hash" placeholder="请输入密码" />
                </a-form-item>

                <!-- 确认密码 -->
                <a-form-item
                    label="确认密码"
                    name="password_check"
                    :rules="[
                      { required: true, message: '请确认密码' },
                      { validator: validatePass },]">
                  <a-input-password v-model:value="formValues.password_check" placeholder="请再次输入密码" />
                </a-form-item>

                <!-- 邮箱输入框 -->
                <a-form-item
                    label="邮箱"
                    name="email"
                    :rules="[
                      { required: true, message: '请输入邮箱' }]">
                  <a-input type:email v-model:value="formValues.email" placeholder="请输入邮箱" />
                </a-form-item>

                <!-- 个人资料输入框 -->
                <a-form-item
                    label="个性签名"
                    name="bio"
                    :rules="[
                      { max: 20, message: '不得多于20个字符！' }]">
                  <a-input v-model:value="formValues.bio" placeholder="请输入个性签名" />
                </a-form-item>

                <a-flex justify="space-evenly">
                  <a-button type="primary" @click="handleSubmit">提交</a-button>
                  <a-button >重置</a-button>
                </a-flex>
              </a-form>

              <a-flex vertical="vertical" v-if="selectedKeys.includes('uploadAvatar')" align="center">
                <a-avatar :size="88" :src="formValues.profile_picture ? formValues.profile_picture : require('@/assets/img/default_avatar.png')"
                          style="justify-self: start;margin: 20px 30px"/>

                <a-upload
                    :action="apiBaseUrl"
                    method="post"
                    @change="handleChange"
                    :headers="headers">

                  <a-button>
                    上传头像
                  </a-button>
                </a-upload>
              </a-flex>

              <a-flex vertical="vertical" v-if="selectedKeys.includes('accountSettings')" align="center">
                <a-button type="primary" danger style="margin-top: 30px" @click="showDeleteModal">注销账号</a-button>
              </a-flex>

              <!-- 注销弹窗 -->
              <a-modal
                  v-model:open="isDeleteModalVisible"
                  title="确定注销吗？（注意！此操作无法回退！）"
                  @ok="handleDelete"
                  @cancel="handleDeleteCancel"/>

            </a-layout-content>

          </a-layout>
        </a-layout-content>
      </a-col>
    </a-row>

  </a-layout>
</template>

<script>
import {getCurrentInstance, ref} from 'vue';
import userInfoService from "@/service/userInfoService";
import {useStore} from "vuex";
//import {useRoute} from 'vue-router';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import router from "@/router";
export default {
  components: {IndexHeader},
  setup(){
    const { proxy } = getCurrentInstance();
    const store = useStore();
    //const route = useRoute();
    // 编辑表单
    const editForm = ref(null);
    const selectedKeys = ref(["editInfo"]);
    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL+"/upload/picture";
    const isDeleteModalVisible = ref(false);
    const headers = {
      authorization: store.state.token,
    };
    const formValues = ref({
      username: "",
      password_hash: "",
      password_check: "",
      email: "",
      profile_picture: null,
      bio: "",
    });
    const getCurrentUserInfo = () => {
      //Number(route.params.id)
      userInfoService.getUserInfo()
          .then(res => {
            formValues.value = res.data.data;
            formValues.value.password_check = formValues.value.password_hash;
          })
          .catch(err => {
            console.log("获取用户信息错误: ", err);
          });
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

    const handleChange = info => {
      console.log("图片上传状态：", info);
      if (info.file.response !== undefined) {
        if (info.file.response.code === 0) {
          formValues.value.profile_picture = info.file.response.data;
          console.log("图片上传成功：", info);
        }
      }
    };

    // 提交表单
    const handleSubmit = async () => {
      if (editForm.value) {
        editForm.value
            .validate()//验证rules规则
            .then(() => {
              console.log("表单提交数据: ", formValues.value);
              userInfoService.editUserInfo(formValues.value)
                  .then(res => {
                    if(res.data.code===0){
                      proxy.$message.success("修改成功");
                    }else{
                      proxy.$message.error(res.data.message);
                    }

                  })
                  .catch(err => {
                    proxy.$message.error(err.desc);
                  });


            })
            .catch(error => {
              console.log("表单校验失败: ", error);
            });
      }
    };

    // 显示确认注销弹窗
    const showDeleteModal = () => {
      isDeleteModalVisible.value = true;
    };
    // 注销用户
    const handleDelete = () => {
      userInfoService.deleteUser()
          .then(()=>{
            proxy.$message.info("注销成功");
            store.commit('logout');
            router.push("/");
          })
          .catch(()=>{
            proxy.$message.error("注销失败");
          })
    };
    // 取消注销
    const handleDeleteCancel = () => {
      isDeleteModalVisible.value = false;
    };

    return{
      editForm,
      formValues,
      selectedKeys,
      headers,
      apiBaseUrl,
      isDeleteModalVisible,
      getCurrentUserInfo,
      handleChange,
      validatePass,
      handleSubmit,
      showDeleteModal,
      handleDelete,
      handleDeleteCancel,
    };
  },
  mounted(){
    this.getCurrentUserInfo();
  }
};

</script>

<style lang="less">


</style>