<script setup>
import {
  LeftCircleOutlined,
  RightCircleOutlined
} from '@ant-design/icons-vue';
</script>

<template>
  <a-carousel arrows>
    <template #prevArrow>
      <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
        <LeftCircleOutlined />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow" style="right: 10px">
        <RightCircleOutlined />
      </div>
    </template>
    <div>
        <img src="@/assets/img/indexPic.png" style="height: 100%;width: 100%;object-fit: fill;" alt="index_post_img" />
    </div>
    <div><h3>2</h3></div>
    <div><h3>3</h3></div>
    <div><h3>4</h3></div>
  </a-carousel>
</template>

<style lang="less" scoped>
:deep(.slick-slide) {
  text-align: center;
  //height: 300px;
  //line-height: 300px;
  background: #ffffff;
  overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.5;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>