<template>
  <div class="boardContainer">
    <div class="left-action">
      <div class="left-action-left">{{ currpage }} / {{ totalCount }}</div>
      <!-- 拓展 -->
      <div class="left-action-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
let currpage = ref(1);
let totalCount = ref(1);
</script>

<style scoped lang="scss">
.boardContainer {
  background: #f5f8f9;
  width: 100%;
  height: 100%;
  .left-action {
    position: fixed;
    bottom: 12px;
    &-left {
      background: #fff;
      padding: 10px 20px;
      margin-left: 12px;
      text-align: center;
      width: 40px;
      height: 20px;
      box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
    }
  }
}
</style>
