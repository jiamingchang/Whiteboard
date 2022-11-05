<script setup lang="ts">
import Canvas from "./Canvas.vue";
import { computed } from "vue";
import store from "@/store";
import { useAnimationPageWidth } from "@/utils/hooks";
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
let isclick = computed(() => (store.state.pageWidth === 0 ? false : true));
let toggleWidth = useAnimationPageWidth();

let currpage = computed(() => store.state.page + 1);
let totalCount = computed(() => store.state.pageList.length);
</script>

<template>
  <div class="boardContainer" ref="container">
    <Canvas />
    <div class="left-action">
      <div
        :class="['left-action-left', isclick ? 'selected' : '']"
        @click="toggleWidth"
      >
        {{ currpage }} / {{ totalCount }}
      </div>
      <!-- 拓展 -->
      <div class="left-action-right"></div>
    </div>
    <div class="right-action">
      <div class="right-action-items">
        <div class="right-action-item iconfont icon-jian"></div>
        <div class="right-action-item">100%</div>
        <div class="right-action-item iconfont icon-tianjia"></div>
        <div
          :class="[
            'right-action-item',
            'iconfont',
            isFullscreen ? 'icon-guanbiquanping' : 'icon-quanping',
          ]"
          @click="toggle"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.boardContainer {
  background: #f5f8f9;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .bgImg {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .canvasBox {
    position: relative;
  }
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
      cursor: pointer;
    }
    .selected {
      color: #3456ff;
    }
  }
  .right-action {
    position: fixed;
    bottom: 12px;
    right: 12px;
    background: #fff;
    padding: 6px 5px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
    &-items {
      text-align: center;
      display: flex;
      display: flex;
      .iconfont {
        font-size: 20px;
      }
    }
    &-item {
      padding: 5px 15px;
      cursor: pointer;
    }
    &-item:hover {
      background: #f6f6f6;
    }
  }
}
</style>
