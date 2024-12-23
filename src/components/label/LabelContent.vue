<template>
  <div id="label-content" >
    <a-empty v-if="data.length === 0"/>
    <div>
      <div class="tag">
        <a-badge class="info-box"
                 v-for="item of data" :key="item.id">
          <div>
            <a-avatar class="avatar" :size="60" :src="item.logo" @click="routerLabelToArticle(item.id)" style="cursor: pointer"/>
          </div>
          <div class="title" @click="routerLabelToArticle(item.id)">{{ item.labelName }}</div>
<!--          <div class="meta-article">{{ item.articleUseCount + ' ' + $t('common.article') }}</div>-->
        </a-badge>
      </div>
    </div>
  </div>
</template>

<script>
// import labelService from "@/service/labelService";
import {ref} from "vue";
import {useRouter} from 'vue-router';
export default {
  components: {

  },
  // 接收父组件传递的属性
  props : {
    data: {
      type: Array,
      default: () => []
    },
    searchContent: {
      type: String,
      default: ''
    }
  },
  setup(){
// 创建响应式数据
//     const searchContentTemp = ref(props.searchContent);
    const labelAddVisible = ref(false);
    const labelEditVisible = ref({});

    const router = useRouter();

// 关闭气泡框方法
    const hideLabelVisibleFn = (labelId) => {
      labelAddVisible.value = false;
      labelEditVisible.value[labelId] = false;
    };


// 路由到标签文章页面方法
    const routerLabelToArticle = (labelId) => {
      router.push('/label/'+labelId.value);
    };

    return {
      hideLabelVisibleFn,
      routerLabelToArticle,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll); // 销毁组件时移除事件监听
  },
  name: "LabelContent",

}
</script>
<style lang="less" scoped>
#label-content .label-search {
  display: flex;
  justify-content: space-between;
  padding: 30px 0;
}

#label-content .tag {
  display: flex;
  flex-wrap: wrap;
}

#label-content .info-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: #fff;
  border-bottom: 20px solid #f0f2f5;

  .title, .avatar {
    cursor: pointer;
    border-radius: 0;
  }

  .title {
    padding-top: 5px;
    font-size: 20px;
    line-height: 40px;
    color: #333;
  }

  .edit {
    margin-top: 5px;
  }

  .meta-article {
    font-size: 16px;
    color: #909090;
  }
}

.badge_style1{
  width:20%;border-right: 20px solid #f0f2f5;
}
.badge_style2{
  width:100%;
}

</style>