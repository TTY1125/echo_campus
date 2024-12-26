<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>
    <main class="main-content">
      <AdminSideBar/>

      <a-flex vertical="vertical">
        <a-flex style="margin: 10px 0">
          <a-button danger
                    type="primary"
                    :disabled="!hasSelected"
                    :loading="state.loading"
                    @click="deleteReports"
                    style="margin-left: 16px;"
          >
            删除
            <span style="margin-left: 8px" v-if="hasSelected">
                  {{ `已选中 ${state.selectedRowKeys.length} 项` }}
                </span>
          </a-button>
        </a-flex>


        <a-table class="table-content"
                 :dataSource="dataSource"
                 :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                 :row-key="record => record.id"
                 :pagination="{ pageSize : 10}"
                 :columns="columns"
                 :scroll="{y : 500}"
        >
          <template #is_handled="{ record }">
            {{ record.is_handled === 0? "待处理" : (record.is_handled === 1? "已审核通过" : (record.is_handled === 2? "已驳回" : "未知状态")) }}
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a
                  @click="passReport(record)"
                  :style="{
                  marginRight: '10px',
                  color: record.is_handled === 0? '#1890ff' : 'gray',
                  cursor: record.is_handled === 0? 'pointer' : 'not-allowed'
                  }"
                  :disabled="record.is_handled !== 0"
              >通过</a>
              <a @click="rejectReport(record)"
                 :style="{
                  color: record.is_handled === 0 ? '#1890ff' : 'gray',
                  cursor: record.is_handled === 0 ? 'pointer' : 'not-allowed'
               }"
                 :disabled="record.is_handled !== 0"
              >拒绝</a>
            </template>
          </template>

        </a-table>
      </a-flex>

    </main>

    <a-modal v-model:visible="isModalVisible" title="举报通过原因" @ok="handleSave(form)" @cancel="handleCancel">
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="通过原因" :name="'admin_reason'">
          <a-input v-model:value="form.admin_reason" />
        </a-form-item>
      </a-form>
    </a-modal>


  </a-layout>
</template>

<script>
import { ref, reactive } from 'vue';
import { onMounted, computed } from 'vue';
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import reportService from "@/service/reportService"
import AdminSideBar from "@/components/admin/AdminSideBar";
import dayjs from "dayjs";

export default {
  components: {
    IndexHeader,
    AdminSideBar
  },
  setup(){
    const dataSource = ref([]);
    const columns = ref([
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '文章标题',
        dataIndex: 'post_title',
        key: 'post_title',
      },
      {
        title: '文章内容',
        dataIndex: 'post_content',
        key: 'post_content',
      },
      {
        title: '举报人姓名',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: '用户举报原因',
        dataIndex: 'user_reason',
        key: 'user_reason',
      },
      {
        title: '举报通过说明',
        dataIndex: 'admin_reason',
        key: 'admin_reason',
      },
      {
        title: '注册时间',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: '处理状态',
        dataIndex: 'is_handled',
        key: 'is_handled',
        slots: {
          customRender: 'is_handled'
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
      post_id: '',
      user_id: '',
      user_reason: '',
      admin_reason: '',
      created_at: '',
      is_handled: '',

      post_title: '',
      post_content: '',
      user_name: '',
    });
    const passReport = (record) => {
      form.id = record.id;
      form.post_id = record.post_id;
      form.user_id = record.user_id;
      form.user_reason = record.user_reason;
      form.created_at = record.created_at;
      form.is_handled = record.is_handled;
      form.post_title = record.post_title;
      form.post_content = record.post_content;
      form.user_name = record.user_name;
      if (form.is_handled !== 0) return;
      isModalVisible.value = true;  // 显示弹窗
    };
    const handleSave = async () => {
      try {
        form.is_handled = 1;
        await reportService.editOtherPostInfo(form.id, form);
        isModalVisible.value = false;  // 隐藏弹窗
        // 在这里重新加载数据
        await getTableData();

        // // 点击通过之后，向后台通知举报人
        // try {
        //   await reportService.notifyUser(form.user_id);
        //   console.log('已通知举报人');
        // } catch (error) {
        //   console.error('通知失败:', error);
        // }

      } catch (error) {
        console.error('更新用户信息失败', error);
      }
    }
    const handleCancel = () => {
      isModalVisible.value = false;  // 隐藏弹窗
    };

    const rejectReport = async(record) => {
      try {
        form.id = record.id;
        form.post_id = record.post_id;
        form.user_id = record.user_id;
        form.user_reason = record.user_reason;
        form.admin_reason = '';
        form.created_at = record.created_at;
        form.post_title = record.post_title;
        form.post_content = record.post_content;
        form.user_name = record.user_name;
        form.is_handled = record.is_handled;
        if (form.is_handled !== 0) return;
        form.is_handled = 2;
        await reportService.editOtherPostInfo(form.id, form);
        // 在这里重新加载数据
        await getTableData();
      } catch (error) {
        console.error('更新用户信息失败', error);
      }
    };


    const state = reactive({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const deleteReports = async () => {
      state.loading = true;

      try {
        console.log('删除选中的举报: ', state.selectedRowKeys)
        //删除选中的用户
        await reportService.deleteReports(state.selectedRowKeys);
        // 删除成功后，刷新数据
        await getTableData();
        // 清空选中的项
        state.selectedRowKeys = [];
      } catch (error) {
        console.error('删除举报失败', error);
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
        const response = await reportService.getAllReportsInfo();
        dataSource.value = response.data.data;
        for(let i in dataSource.value){
          dataSource.value[i].created_at = dayjs(dataSource.value[i].created_at).format('YYYY-MM-DD HH:mm:ss');
        }
        console.log("所有举报的信息:", dataSource);
        isLoading.value = false;
      } catch (error) {
        console.error('获取举报信息错误', error);
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

      passReport,
      handleSave,
      handleCancel,
      isModalVisible,
      form,
      rejectReport,

      hasSelected,
      deleteReports,
      onSelectChange,
      state
    };
  },
  name: "ReportManage"
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

</style>