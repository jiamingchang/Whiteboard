<script setup lang="ts">
import Page from "@/components/Page.vue";
import Board from "@/components/Board.vue";
import { ref } from "vue";
defineProps<{ msg: string }>();

const count = ref(0);
</script>
<template>
  <div class="whiteboardContainer">
    <div class="page">
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
  }
  .board {
    flex: 1;
  }
}
</style>
