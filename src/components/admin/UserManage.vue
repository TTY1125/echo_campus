<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <main class="main-content">

        <AdminSideBar/>

        <div class="table-button-container">
          <a-button type="primary" @click="showAddUserModal" style="margin-top: 16px; margin-left: 16px;width: 80px;">
            新增用户
          </a-button>

          <div style="margin-bottom: 16px">
            <a-button
                type="primary"
                :disabled="!hasSelected"
                :loading="state.loading"
                @click="deleteUsers"
                style="margin-top: 16px; margin-left: 16px; width: 120px;"
            >
              删除
            </a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `已选中 ${state.selectedRowKeys.length} 项` }}
              </template>
            </span>
          </div>

          <a-table class="table-content"
                   :dataSource="dataSource"
                   :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                   :row-key="record => record.id"
                   :pagination="{ pageSize : 10}"
                   :columns="columns"
                   :scroll="{y : 500}"
          >
            <template #profile_picture="{ record }">
              <img :src="
              record.profile_picture ? record.profile_picture : require('@/assets/img/default_avatar2.jpg')"
                   alt="Profile Picture"
                   style="width: 50px; height: 50px; border-radius: 50%;"
              />
            </template>
            <!--            <template v-slot:num="slotProps">-->
            <!--              {{(current - 1 ) * pageSize + slotProps.index + 1}}-->
            <!--            </template>>-->
            <template #is_admin="{ record }">
              {{record.is_admin ? "管理员" : "用户"}}
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <a @click="editUser(record)">编辑</a>
              </template>
            </template>

          </a-table>

        </div>


    </main>

    <a-modal v-model:visible="isModalVisible" title="编辑用户" @ok="handleSave(form)" @cancel="handleCancel">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="姓名" :name="'username'">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item label="邮箱" :name="'email'">
          <a-input v-model:value="form.email" />
        </a-form-item>
        <a-form-item label="注册时间" :name="'created_at'">
          <a-input v-model:value="form.created_at" />
        </a-form-item>
        <a-form-item label="个性签名" :name="'bio'">
          <a-input v-model:value="form.bio" />
        </a-form-item>
        <a-form-item label="头像" :name="'profile_picture'">
            <img :src="form.profile_picture ? form.profile_picture : require('@/assets/img/default_avatar2.jpg')"
                 alt="头像"
                 style="width: 50px; height: 50px; border-radius: 50%;"
            />
        </a-form-item>
        <a-form-item label="权限" :name="'is_admin'">
          <a-select v-model:value="form.is_admin" :placeholder="'请选择权限'" style="width: 100%">
            <a-select-option value="false">用户</a-select-option>
            <a-select-option value="true">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="isAddModalVisible" title="新增用户" @ok="handleAdd" @cancel="handleCancelAdd">
      <a-form :form="addForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="姓名" :name="'username'">
          <a-input v-model:value="addForm.username" />
        </a-form-item>
        <a-form-item label="密码" :name="'password_hash'">
          <a-input v-model:value="addForm.password_hash" />
        </a-form-item>
        <a-form-item label="邮箱" :name="'email'">
          <a-input v-model:value="addForm.email" />
        </a-form-item>
        <a-form-item label="注册时间" :name="'created_at'">
          <a-input v-model:value="addForm.created_at" />
        </a-form-item>
        <a-form-item label="个性签名" :name="'bio'">
          <a-input v-model:value="addForm.bio" />
        </a-form-item>
        <a-form-item label="头像" :name="'profile_picture'">
          <img :src="addForm.profile_picture ? addForm.profile_picture : require('@/assets/img/default_avatar2.jpg')"
               alt="头像"
               style="width: 50px; height: 50px; border-radius: 50%;"
          />
        </a-form-item>
        <a-form-item label="权限" :name="'is_admin'">
          <a-select v-model:value="addForm.is_admin" :placeholder="'请选择权限'" style="width: 100%">
            <a-select-option value="false">用户</a-select-option>
            <a-select-option value="true">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

  </a-layout>
</template>

<script>
import { ref, reactive } from 'vue';
import { onMounted } from 'vue';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import userInfoService from "@/service/userInfoService";
import { computed } from 'vue'
import AdminSideBar from "@/components/admin/AdminSideBar";

export default {
  components: {
    IndexHeader,
    AdminSideBar
  },
  setup(){
    const dataSource = ref([]);
    const columns = ref([
      // {
      //   title: '序号',
      //   dataIndex: 'serial',
      //   key: 'serial',
      //   slots: {
      //     customRender: 'num'
      //   }
      // },
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '注册时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '头像',
        dataIndex: 'profile_picture',
        key: 'profile_picture',
        slots: {
          customRender: 'profile_picture'
        }
      },
      {
        title: '个性签名',
        dataIndex: 'bio',
        key: 'bio',
      },
      {
        title: '权限',
        dataIndex: 'is_admin',
        key: 'is_admin',
        slots: {
          customRender: 'is_admin'
        }
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
      },
    ]);

    const isModalVisible = ref(false);  // 控制弹窗显示
    const form = reactive({
      id: '',
      username: '',
      email: '',
      created_at: '',
      bio: '',
      profile_picture: null,
      is_admin: '',
    });
    const editUser = (record) => {
      form.id = record.id;
      form.username = record.username;
      form.email = record.email;
      form.created_at = record.created_at;
      form.bio = record.bio;
      form.profile_picture = record.profile_picture;
      form.is_admin = { value: String(record.is_admin), label: record.is_admin ? '管理员' : '用户' };
      isModalVisible.value = true;  // 显示弹窗
    };
    const handleSave = async () => {
      try {
        form.is_admin = form.is_admin === 'true';  // 使用字符串比较转换为布尔值
        await userInfoService.editOtherUserInfo(form.id, form);
        isModalVisible.value = false;  // 隐藏弹窗
        // 在这里重新加载数据
        await getTableData();
      } catch (error) {
        console.error('更新用户信息失败', error);
      }
    }
    const handleCancel = () => {
      isModalVisible.value = false;  // 隐藏弹窗
    };


    const isAddModalVisible = ref(false); // 控制新增弹窗显示
    const addForm = reactive({
      username: '',
      password_hash: '',
      email: '',
      created_at: '',
      bio: '',
      profile_picture: null,
      is_admin: 'false',
    });
    const showAddUserModal = () => {
      isAddModalVisible.value = true;  // 显示新增用户弹窗
    };
    const handleAdd = async () => {
      try {
        addForm.is_admin = addForm.is_admin === 'true'; // 转换为布尔值
        await userInfoService.addUserInfo(addForm); // 发送新增请求
        isAddModalVisible.value = false; // 隐藏弹窗
        await getTableData(); // 刷新数据
      } catch (error) {
        console.error('新增用户失败', error);
      }
    };
    const handleCancelAdd = () => {
      isAddModalVisible.value = false; // 取消时隐藏新增弹窗
    };


    const state = reactive({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const deleteUsers = async () => {
      state.loading = true;

      try {
        console.log('删除选中的用户: ', state.selectedRowKeys)
        //删除选中的用户
         await userInfoService.deleteOtherUserInfo(state.selectedRowKeys);
        // 删除成功后，刷新数据
         await getTableData();
        // 清空选中的项
         state.selectedRowKeys = [];
      } catch (error) {
        console.error('删除用户失败', error);
      } finally {
        state.loading = false;
      }

      setTimeout(() => {
        state.loading = false;
        state.selectedRowKeys = [];
      }, 1000);
    };
    const onSelectChange = selectedRowKeys => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };




    let isLoading = ref(false);
    const getTableData = async () => {
      isLoading.value = true;
      try {
        const response = await userInfoService.getAllUsersInfo();
        dataSource.value = response.data.data;
        isLoading.value = false;
      } catch (error) {
        console.error('获取用户信息错误', error);
      }
    };

    onMounted(() => {
      getTableData();
    });

    return {
      AdminSideBar,
      IndexHeader,
      dataSource,
      columns,

      editUser,
      handleSave,
      handleCancel,
      isModalVisible,
      form,


      isAddModalVisible,
      addForm,
      showAddUserModal,
      handleAdd,
      handleCancelAdd,


      hasSelected,
      deleteUsers,
      onSelectChange,
      state
    };
  },
  name: "UserManage"
}
</script>

<style scoped>
/* 整体布局 */
#components-layout-basic {
  display: flex;
  flex-direction: column; /* 垂直布局 */
  height: 100vh; /* 占满屏幕高度 */
}

/* 顶部 Header */
.header {
  flex-shrink: 0; /* 固定高度 */
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* 主体部分 */
.main-content {
  flex-grow: 1;
  display: flex; /* 左右布局 */
  background: #f5f5f5;
}

/* 左侧侧边栏 */
.sidebar {
  width: 256px;
  flex-shrink: 0; /* 固定宽度 */
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: calc(100vh - 64px); /* 减去 Header 的高度 */
  overflow: auto;
}

/* 右侧表格内容 */
.table-content {
  flex-grow: 1;
  padding: 16px;
  background: #fff;
  box-sizing: border-box;
  max-height: calc(100vh - 64px); /* 设置最大高度以适应剩余的空间 */
  overflow-y: auto; /* 启用垂直滚动条 */
}

/* 固定表头 */
.table-content .ant-table-thead > tr > th {
  position: sticky;
  top: 0;
  background: #fff; /* 防止表头透明度导致内容重叠 */
  z-index: 1; /* 确保表头在内容之上 */
}

.table-button-container {
  display: flex;
  flex-direction: column; /* 让内部的 table 和 button 垂直分布 */
}

.table-content .ant-table-thead th {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 给表头添加阴影效果 */
  z-index: 20; /* 增加层级，确保表头在上方 */
}
</style>