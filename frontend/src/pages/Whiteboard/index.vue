<script setup lang="ts">
import Page from "@/components/Page.vue";
import Board from "@/components/Board.vue";
import store from "@/store";
import { ref, computed, watch, toRaw, onMounted } from "vue";
import { StorageKey } from "@/store/state";
import { ElMessage, ElNotification } from "element-plus";
import { updateRoom } from "@/service";
let pageWidth = computed(() => store.state.pageWidth);
let pageList = computed(() => store.state.pageList);
// let isSendRequest = computed(() => store.state.isSendRequest);
let acceptRequestId = computed(() => store.state.acceptRequestId);
let acceptReadOnly = computed(() => store.state.acceptReadOnly);
let token = sessionStorage.getItem(StorageKey.TOKEN) + "";
const nickname = sessionStorage.getItem(StorageKey.USER_NAME) + "";
let notification: any;

window.submit = async function () {
  await updateRoom({
    read_only: acceptReadOnly.value,
  });
  notification.close();
};

watch(
  () => acceptRequestId.value,
  (val) => {
    notification = ElNotification({
      title: "用户请求切换模式",
      dangerouslyUseHTMLString: true,
      message: `<div style="width: 100%; display: flex; justify-content: space-around">
      <div>${acceptReadOnly.value == 1 ? "只读模式" : "协作模式"}</div>
      <div style="background-color: #35456a;  padding: 0 4px; color: white; border-radios: 5px;" onclick="submit()">确定</div>
    </div>`,
      duration: 0,
    });
  }
);

let url = "wss://hm.sztufsrlab.com/wb/live";
let websocket: any;

onMounted(() => {
  connectWebsocket();
});

let sendername: any = nickname;

watch(
  () => pageList.value,
  (val) => {
    if (nickname === sendername)
      websocket.send(
        JSON.stringify({
          message: JSON.stringify(val),
        })
      );
    // 每次发送为恢复初始化
    sendername = nickname;
  },
  { deep: true }
);

function connectWebsocket() {
  if (typeof WebSocket === "undefined") {
    console.log("您的浏览器不支持WebSocket");
    return;
  } else {
    // 打开一个websocket
    websocket = new WebSocket(url);
    // 建立连接
    websocket.onopen = () => {
      // 打开是发送token
      websocket.send(
        JSON.stringify({
          token,
        })
      );
    };
    // 客户端接收服务端返回的数据
    websocket.onmessage = (evt: any) => {
      console.log("websocket返回的数据：", evt);
      const data = JSON.parse(evt.data);
      if (data.code === 101) {
        websocket.send(
          JSON.stringify({
            system: nickname,
            message: JSON.stringify(pageList.value),
          })
        );
      }
      if (data.code === 0) {
        const newPageList = JSON.parse(data.message);
        console.log(newPageList);
        sendername = data.system;
        store.commit("changePageList", newPageList);
      }
      if (data.code === 102) {
        ElMessage.warning(data.system);
      }
      // todo
      // 房主更改为只读
      if (data.code === 103) {
        store.commit("changeIsReadOnly", true);
        ElMessage("房主改成只读模式了");
      }
      // 房主更改为协作
      if (data.code === 104) {
        store.commit("changeIsReadOnly", false);
        ElMessage("房主改成协作模式了");
      }
      // 用户请求更改权限：read_only(1：只读, 2：协作)
      if (data.code === 105) {
        if (data.system.includes("协作")) {
          store.commit("changeIsAcceptRequest", 2);
        } else {
          store.commit("changeIsAcceptRequest", 1);
        }
      }
    };
    // 发生错误时
    websocket.onerror = (evt: any) => {
      console.log("websocket错误：", evt);
    };
    // 关闭连接
    websocket.onclose = (evt: any) => {
      console.log("websocket关闭：", evt);
    };
  }
}
</script>
<template>
  <div class="whiteboardContainer">
    <div
      class="page"
      :style="{
        width: pageWidth + 'px',
      }"
    >
      <Page />
    </div>
    <div class="board">
      <Board />
    </div>
  </div>
</template>

<style scoped lang="scss">
.whiteboardContainer {
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;

  .page {
    position: absolute;
    z-index: 100;
    overflow: hidden;
    height: 100%;
    transition: width 0.5s linear;
    background: #fff;
    border-right: 1px solid #f0f0f0;
  }
  .board {
    width: 100%;
    height: 100%;
  }
}
</style>
