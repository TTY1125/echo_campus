<template>
  <div>
    <h2>WebSocket 示例</h2>
    <div>
      <strong>消息记录：</strong>
      <div v-for="(msg, index) in messages" :key="index">
        {{ msg }}
      </div>
    </div>
    <div>
      <input v-model="newMessage" placeholder="输入消息">
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: "WebSocketExample",
  setup() {
    // 使用 ref 创建响应式数据
    const websock = ref(null); // WebSocket 对象
    const messages = ref([]); // 存储接收到的消息
    const newMessage = ref(''); // 存储用户输入的消息
    const shopId = ref('2'); // 动态用户标识符

    // 初始化 WebSocket
    const initWebSocket = () => {
      const wsUrl = `ws://localhost:8080/websocket/${shopId.value}`;
      websock.value = new WebSocket(wsUrl);

      // 监听连接成功事件
      websock.value.onopen = websocketOnOpen;

      // 监听错误事件
      websock.value.onerror = websocketOnError;

      // 监听接收消息事件
      websock.value.onmessage = websocketOnMessage;

      // 监听关闭连接事件
      websock.value.onclose = websocketOnClose;
    };

    // WebSocket 连接成功
    const websocketOnOpen = () => {
      console.log("WebSocket 连接成功");
    };

    // WebSocket 连接错误
    const websocketOnError = (error) => {
      console.error("WebSocket 连接发生错误:", error);
    };

    // 接收到消息
    const websocketOnMessage = (event) => {
      const receivedData = event.data;
      console.log("接收到消息:", receivedData);

      // 将消息添加到消息记录
      messages.value.push(receivedData);
    };

    // WebSocket 连接关闭
    const websocketOnClose = (event) => {
      console.log("WebSocket 连接关闭:", event);
    };

    // 发送消息
    const sendMessage = () => {
      if (websock.value && websock.value.readyState === WebSocket.OPEN) {
        websock.value.send(newMessage.value);
        console.log("发送消息:", newMessage.value);
        newMessage.value = ''; // 清空输入框
      } else {
        console.warn("WebSocket 连接未打开，无法发送消息");
      }
    };

    // 页面加载时初始化 WebSocket
    onMounted(() => {
      initWebSocket();
    });

    // 页面卸载时关闭 WebSocket
    onUnmounted(() => {
      if (websock.value) {
        websock.value.close();
        console.log("WebSocket 已手动关闭");
      }
    });

    // 返回需要在模板中使用的变量和方法
    return {
      messages,
      newMessage,
      sendMessage
    };
  }
};
</script>

<style scoped>
h2 {
  font-size: 20px;
  color: #333;
}

input {
  padding: 5px;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

div {
  margin-bottom: 10px;
}
</style>