<script setup lang="ts">
import Page from "@/components/Page.vue";
import Board from "@/components/Board.vue";
import store from "@/store";
import { ref, computed } from "vue";
defineProps<{ msg: string }>();
let pageWidth = computed(() => store.state.pageWidth);

const count = ref(0);
</script>
<template>
  <div class="whiteboardContainer">
    <div
      class="page"
      :style="{
        width: pageWidth + 'px',
        opacity: pageWidth === 0 ? 0 : 1,
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
    width: 330px;
    height: 100%;
    transition: width 0.5s linear;
    border-right: 1px solid #f0f0f0;
  }
  .board {
    flex: 1;
  }
}
</style>
