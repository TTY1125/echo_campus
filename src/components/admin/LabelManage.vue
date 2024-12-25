<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <main class="main-content">

      <AdminSideBar/>

      <div class="table-button-container">
        <a-button type="primary" @click="showAddUserModal" style="margin-top: 16px; margin-left: 16px;width: 80px;">
          新增标签
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
          <template #label_icon="{ record }">
            <img :src="
              record.label_icon ? record.label_icon : require('@/assets/img/default_avatar2.jpg')"
                 alt="图标"
                 style="width: 50px; height: 50px; border-radius: 50%;"
            />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a @click="editUser(record)">编辑</a>
            </template>
          </template>

        </a-table>

      </div>


    </main>

    <a-modal v-model:visible="isModalVisible" title="编辑标签" @ok="handleSave(form)" @cancel="handleCancel">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="标签名" :name="'label_name'">
          <a-input v-model:value="form.label_name" />
        </a-form-item>
        <a-form-item label="标签描述" :name="'description'">
          <a-input v-model:value="form.description" />
        </a-form-item>
        <a-form-item label="创建时间" :name="'created_at'">
          <a-input v-model:value="form.created_at" />
        </a-form-item>
        <a-form-item label="图标" :name="'label_icon'">
          <img :src="form.label_icon ? form.label_icon : require('@/assets/img/default_avatar2.jpg')"
               alt="图标"
               style="width: 50px; height: 50px; border-radius: 50%;"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:visible="isAddModalVisible" title="新增标签" @ok="handleAdd" @cancel="handleCancelAdd">
      <a-form :form="addForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="标签名" :name="'label_name'">
          <a-input v-model:value="addForm.label_name" />
        </a-form-item>
        <a-form-item label="标签描述" :name="'description'">
          <a-input v-model:value="addForm.description" />
        </a-form-item>
        <a-form-item label="创建时间" :name="'created_at'">
          <a-input v-model:value="addForm.created_at" />
        </a-form-item>
        <a-form-item label="图标" :name="'label_icon'">
          <img :src="addForm.label_icon ? addForm.label_icon : require('@/assets/img/default_avatar2.jpg')"
               alt="图标"
               style="width: 50px; height: 50px; border-radius: 50%;"
          />
        </a-form-item>
      </a-form>
    </a-modal>

  </a-layout>
</template>

<script>
import { ref, reactive } from 'vue';
import { onMounted } from 'vue';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import { computed } from 'vue'
import AdminSideBar from "@/components/admin/AdminSideBar";
import labelService from "@/service/labelService";

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
        title: '标签名',
        dataIndex: 'label_name',
        key: 'label_name',
      },
      {
        title: '标签描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '标签图标',
        dataIndex: 'label_icon',
        key: 'label_icon',
        slots: {
          customRender: 'label_icon'
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
      label_name: '',
      description: '',
      created_at: '',
      label_icon: null,
    });
    const editUser = (record) => {
      form.id = record.id;
      form.label_name = record.label_name;
      form.description = record.description;
      form.created_at = record.created_at;
      form.label_icon = record.label_icon;
      isModalVisible.value = true;  // 显示弹窗
    };
    const handleSave = async () => {
      try {
        await labelService.editOtherLabelInfo(form.id, form);
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
      label_name: '',
      description: '',
      created_at: '',
      label_icon: null,
    });
    const showAddUserModal = () => {
      isAddModalVisible.value = true;  // 显示新增用户弹窗
    };
    const handleAdd = async () => {
      try {
        await labelService.addLabelInfo(addForm); // 发送新增请求
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
        await labelService.deleteOtherLabelInfo(state.selectedRowKeys);
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
        const response = await labelService.getAllLabels();
        dataSource.value = response.data.data;
        isLoading.value = false;
      } catch (error) {
        console.error('获取标签信息错误', error);
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
  name: "LabelManage"
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