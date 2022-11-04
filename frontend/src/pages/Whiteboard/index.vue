<script setup lang="ts">
import Page from "@/components/Page.vue";
import Board from "@/components/Board.vue";
import store from "@/store";
import { ref, computed } from "vue";
defineProps<{ msg: string }>();
let pageWidth = computed(() => store.state.pageWidth);
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

  .page {
    position: relative;
    overflow: hidden;
    height: 100%;
    transition: width 0.5s linear;
    border-right: 1px solid #f0f0f0;
  }
  .board {
    flex: 1;
  }
}
</style>
