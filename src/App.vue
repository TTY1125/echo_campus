<template>
  <a-locale-provider :locale="zhCN">
    <div id="app">
      <router-view :key="$route.params.id"/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      zhCN,
    };
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #f0f2f5;
}
</style>
