<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="main-content" style="display: flex">
        <AdminSideBar/>

        <a-flex vertical="vertical" style="width: 100%; height: 400px;background-color: white;margin: 25px">
          <a-flex style="justify-content: space-between;margin-top: 25px">
            <a-radio-group v-model:value="range" button-style="solid" style="position: absolute;margin-left: 20px" @change="handleChange">
              <a-radio-button value="0">1周</a-radio-button>
              <a-radio-button value="1">1月</a-radio-button>
              <a-radio-button value="2">3月</a-radio-button>
              <a-radio-button value="3">1年</a-radio-button>
            </a-radio-group>
            <span style="font-weight: bold;font-size: 22px;flex: 1;">{{chartTitle}}</span>
          </a-flex>

          <e-charts :option="option" :auto-resize="true" />
        </a-flex>

      </main>
    </a-layout-content>

  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/header/IndexHeader.vue";
import AdminSideBar from "@/components/admin/AdminSideBar";

import adminService from "@/service/adminService";
import {computed, ref} from "vue";

export default {
  components: {
    IndexHeader,
    AdminSideBar,
  },
  setup(){
    //模拟数据count的字段对应Y轴，date字段对应X轴
    const chartData = ref([]);
    const range = ref('0');
    const chartTitle = ref("最近1周的发帖量统计数据");
    const option=computed(()=>{
      return{
        xAxis:{
          type:'category',
          data:chartData.value.map(v=>v.date)
        },
        yAxis:{
          type:'value',
        },
        series:[
          {
            type:'line',
            data:chartData.value.map(v=>v.count)
          }
        ]
      }
    });

    const getStatPost = async () =>{
      try {
        let res = await adminService.statPost(Number(range.value));
        chartData.value = res.data.data;
        console.log(res.data.data);
      }catch (e) {
        console.log("获得帖子统计失败");
      }
    };

    const handleChange = () =>{
      let x = range.value;
      let y = "";
      if(x==='0'){
        y="1周";
      }else if(x==='1'){
        y="1月";
      }else if(x==='2'){
        y="3月";
      }else if(x==='3'){
        y="1年";
      }
      chartTitle.value = `最近${y}的发帖量统计数据`;
      getStatPost();
    };

    return {
      range,
      option,
      chartTitle,
      getStatPost,
      handleChange,
    };
  },
  name: "AdminIndex",
  async mounted() {
    await this.getStatPost();
  }

}
</script>

<style scoped>
.header {
  flex-shrink: 0; /* 固定高度 */
  height: 64px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

</style>