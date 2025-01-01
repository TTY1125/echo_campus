<template>
  <a-layout>
    <IndexHeader class="header"/>

    <a-layout-content style="padding-top: 64px;z-index: 0;">
      <main class="main-content" style="display: flex;">
        <a-row style="min-height: 686px;background-color: #f0f2f5">
          <a-col :lg="{span:16,offset:4}" :xs="{span:20,offset:2}" style="background-color: white;margin-top: 30px;padding: 40px">

            <h2 style="margin-top: 10px"><strong>关于回声校园</strong></h2>

            <div style="text-align: start;font-size: 17px;line-height: 30px">
              <p>欢迎来到<strong>回声校园</strong>，一个为广大学生和教育工作者提供创新学习与互动交流平台的社区。我们的使命是通过技术和创新，打破教育资源的边界，让每个学生都能在一个平等、开放、互动的环境中成长。</p>
              <p><strong>回声校园致力于</strong>提供多元化的学习资源和社交机会，帮助学生和教育者在学术上相互启发、在职业发展中共同进步。我们相信，教育不仅仅是课堂上的传授知识，更是一次次思想的碰撞与经验的积累。通过回声校园，你可以发现来自不同学校、地区的知识宝库，与志同道合的人分享你的见解、探索新的学习方式，成为更好的自己。</p>
              <p>无论你是学生、教师还是教育从业者，这里都是你释放潜能、寻求答案、建立联系、获得灵感的理想之地。</p>
              <p><strong>我们的愿景是</strong>打造一个开放、自由的教育生态圈，让每一位用户都能在这里找到属于自己的学习旅程，并感受到知识的力量和智慧的回响。</p>
              <p><strong>欢迎加入回声校园，让我们一起，在知识的世界里发出属于自己的声音！</strong></p>
            </div>



          </a-col>
        </a-row>

      </main>
    </a-layout-content>
  </a-layout>
</template>

<script setup>

import IndexHeader from "@/components/index/header/IndexHeader.vue";
</script>

<style scoped lang="less">

</style>