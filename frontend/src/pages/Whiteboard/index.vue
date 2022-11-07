<script setup lang="ts">
import Page from "@/components/Page.vue";
import Board from "@/components/Board.vue";
import store from "@/store";
import { ref, computed, watch } from "vue";
let pageWidth = computed(() => store.state.pageWidth);
let state = computed(() => store.state);

// webscoket总接口
watch(
  () => state.value,
  (val) => {
    console.log(val);
  }
);
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
