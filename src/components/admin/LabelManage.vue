<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <main class="main-content">

      <AdminSideBar/>

      <div class="table-button-container">
        <a-flex style="margin:10px 0">

          <a-button type="primary" @click="showAddUserModal" style="margin-top: 16px; margin-left: 16px;width: 80px;">
            新增标签
          </a-button>

          <div style="margin-bottom: 16px">
            <a-button
                type="primary"
                :disabled="!hasSelected"
                :loading="state.loading"
                @click="deleteUsers"
                style="margin-top: 16px; margin-left: 16px; width: 80px;"
            >
              删除
            </a-button>
            <span style="margin-left: 8px">
                <template v-if="hasSelected">
                  {{ `已选中 ${state.selectedRowKeys.length} 项` }}
                </template>
              </span>
          </div>
        </a-flex>

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
          <template
              #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          >
            <div style="padding: 8px">
              <a-input
                  ref="searchInput"
                  :placeholder="`Search ${column.dataIndex}`"
                  :value="selectedKeys[0]"
                  style="width: 188px; margin-bottom: 8px; display: block"
                  @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                  @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
              />
              <a-button
                  type="primary"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                  @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
              >
                <template #icon><SearchOutlined /></template>
                Search
              </a-button>
              <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
                Reset
              </a-button>
            </div>
          </template>
          <template #customFilterIcon="{ filtered }">
            <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
          </template>
          <template #bodyCell2="{ text, column }">
      <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
        >
          <mark
              v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
              :key="i"
              class="highlight"
          >
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
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
        <a-form-item label="图标" :name="'label_icon'">
          <a-upload
              v-model:file-list="label_icon_url"
              :action="apiBaseUrl"
              method="post"
              @remove="handleIconCancelEdit"
              @change="handleChangeEdit"
              list-type="picture-card"
              @preview="handlePreviewEdit"
              :headers="headers">


            <div v-if="!fileUploadEdit">
              <PlusOutlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
          <a-modal :open="previewVisibleEdit" :title="previewTitleEdit" :footer="null" @cancel="handlePreviewCancelEdit">
            <img alt="example" style="width: 100%" :src="previewImageEdit" />
          </a-modal>

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
        <a-form-item label="图标" :name="'label_icon'">
          <a-upload
              :action="apiBaseUrl"
              method="post"
              @remove="handleIconCancel"
              @change="handleChange"
              list-type="picture-card"
              @preview="handlePreview"
              :headers="headers">


              <div v-if="!fileUpload">
                <PlusOutlined />
                <div style="margin-top: 8px">上传</div>
              </div>
          </a-upload>
          <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handlePreviewCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>

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
import {useStore} from "vuex";
import {PlusOutlined} from '@ant-design/icons-vue';
import dayjs from "dayjs";
import { SearchOutlined } from '@ant-design/icons-vue';
import { nextTick } from 'vue';

export default {
  components: {
    IndexHeader,
    AdminSideBar,
    PlusOutlined,
    SearchOutlined
  },
  setup(){
    const dataSource = ref([]);
    const state2 = reactive({
      searchText: '',
      searchedColumn: '',
    });
    const searchInput = ref();
    const columns = ref([
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '标签名',
        dataIndex: 'label_name',
        key: 'label_name',
        customFilterDropdown: true,
        onFilter: (value, record) => record.label_name.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
          if (visible) {
            setTimeout(() => {
              console.log('visible', searchInput);
              nextTick(() => {
                searchInput.value?.focus();
              });
            }, 100);
          }
        },
      },
      {
        title: '标签描述',
        dataIndex: 'description',
        key: 'description',
        customFilterDropdown: true,
        onFilter: (value, record) => record.description.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: visible => {
          if (visible) {
            setTimeout(() => {
              console.log('visible', searchInput);
              nextTick(() => {
                searchInput.value?.focus();
              });
            }, 100);
          }
        },
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      state2.searchText = selectedKeys[0];
      state2.searchedColumn = dataIndex;
    };
    const handleReset = clearFilters => {
      clearFilters({
        confirm: true,
      });
      state2.searchText = '';
    };

    const isModalVisible = ref(false);  // 控制弹窗显示
    const label_icon_url = ref([]);
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
      label_icon_url.value.length = 0;
      label_icon_url.value.push({url:record.label_icon});
      console.log("label_icon_url: ", label_icon_url);
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

    let fileUploadEdit = ref(true);

    const handleChangeEdit = info => {
      if(info.file.status === 'removed'){
        return;
      }
      console.log("图片上传状态：", info);
      console.log("form: ", form);
      if (info.file.response !== undefined) {
        if (info.file.response.code === 0) {
          form.label_icon = info.file.response.data;
          console.log("图片上传成功：", info);
          fileUploadEdit.value = true;
        }
      }
    };
    const previewVisibleEdit = ref(false);
    const previewImageEdit = ref('');
    const previewTitleEdit = ref('');

    const handlePreviewCancelEdit = () => {
      previewVisibleEdit.value = false;
      previewTitleEdit.value = '';
    };
    const handleIconCancelEdit = () => {
      fileUploadEdit.value = false;
      console.log('Preview canceled, fileUpload reset:', fileUploadEdit.value);
    };
    const handlePreviewEdit = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImageEdit.value = file.url || file.preview;
      previewVisibleEdit.value = true;
      previewTitleEdit.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    };




    const isAddModalVisible = ref(false); // 控制新增弹窗显示
    const addForm = reactive({
      label_name: '',
      description: '',
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
    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL+"/upload/labelIcon";
    let fileUpload = ref(false);
    const handleChange = info => {
      if(info.file.status === 'removed'){
        return;
      }
      console.log("图片上传状态：", info);
      console.log("addForm: ", addForm);
      if (info.file.response !== undefined) {
        if (info.file.response.code === 0) {
          addForm.label_icon = info.file.response.data;
          console.log("图片上传成功：", info);
          fileUpload.value = true;
        }
      }
    };
    const store = useStore();
    const headers = {
      authorization: store.state.token,
    };
    const previewVisible = ref(false);
    const previewImage = ref('');
    const previewTitle = ref('');

    const handlePreviewCancel = () => {
      previewVisible.value = false;
      previewTitle.value = '';
    };
    const handleIconCancel = () => {
      fileUpload.value = false;
      console.log('Preview canceled, fileUpload reset:', fileUpload.value);
    };
    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }
    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      previewImage.value = file.url || file.preview;
      previewVisible.value = true;
      previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
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
        for(let i in dataSource.value){
          dataSource.value[i].created_at = dayjs(dataSource.value[i].created_at).format('YYYY-MM-DD HH:mm:ss');
        }
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
      handleChangeEdit,
      handlePreviewCancelEdit,
      handleIconCancelEdit,
      handlePreviewEdit,
      previewVisibleEdit,
      previewTitleEdit,
      previewImageEdit,
      fileUploadEdit,
      label_icon_url,


      isAddModalVisible,
      addForm,
      showAddUserModal,
      handleAdd,
      handleCancelAdd,
      apiBaseUrl,
      handleChange,
      headers,
      handleIconCancel,
      handlePreviewCancel,
      handlePreview,
      previewVisible,
      previewTitle,
      previewImage,
      fileUpload,


      hasSelected,
      deleteUsers,
      onSelectChange,
      state,

      handleSearch,
      handleReset,
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