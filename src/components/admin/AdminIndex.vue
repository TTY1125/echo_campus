<template>
  <a-layout id="components-layout-basic">
    <IndexHeader class="header"/>

    <a-layout-content>
      <main class="main-content" style="display: flex">
        <AdminSideBar/>


      <a-flex vertical="vertical" style="width: 100%; height: 400px;background-color: white;margin: 25px">
      <WebSocketExample/>
        <a-flex>
          <a-radio-group v-model:value="range" button-style="solid">
            <a-radio-button value="0">1周</a-radio-button>
            <a-radio-button value="1">1月</a-radio-button>
            <a-radio-button value="2">3月</a-radio-button>
            <a-radio-button value="3">1年</a-radio-button>
          </a-radio-group>
          <span style="font-weight: bold;font-size: 22px;margin-left: 40px">最近xx天的发帖量统计数据</span>
        </a-flex>

        <e-charts :option="option" :auto-resize="true"/>
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
import WebSocketExample from "@/components/message/messageDefine.vue"

export default {
  components: {
    IndexHeader,
    AdminSideBar,
    WebSocketExample
  },
  setup(){
    //模拟数据count的字段对应Y轴，date字段对应X轴
    const chartData = ref([]);
    const range = ref("0");
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
    }

    return {
      range,
      option,
      getStatPost,
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