<script setup lang="ts">
import { useAnimationPageWidth } from "@/utils/hooks";
import store from "@/store";
import { ref, computed } from "vue";
const close = useAnimationPageWidth();
let pageList = computed(() => store.state.pageList);

// 一开始默认选中第一个
let selectPage = computed(() => store.state.page);
let hoverIndex = ref<number>(-1);

const mouseleaveHandle = () => {
  hoverIndex.value = -1;
};
const mousemoveHandle = (index: number) => {
  hoverIndex.value = index;
};
const selectPageHandle = (pageId: String) => {
  store.commit("selectCurrPage", pageId);
};

const addPage = () => {
  store.commit("addPage");
};
</script>
<template>
  <div class="pageContainer">
    <div class="header">
      <div class="header-text">多页</div>
      <div class="iconfont icon-cuowuguanbiquxiao" @click="close"></div>
    </div>
    <div class="body">
      <div class="page-list">
        <div
          v-for="(item, index) in pageList"
          :key="index"
          @mousemove="mousemoveHandle(index)"
          @mouseleave="mouseleaveHandle"
          @click="selectPageHandle(item.pageId)"
          :class="['page-item', selectPage === index ? 'selected' : '']"
        >
          <div
            class="more-action"
            v-if="selectPage === index || hoverIndex === index"
          >
            <span class="iconfont icon-gengduo"></span>
          </div>

          <span class="page-item-text"
            >{{ index + 1 }}.画布 {{ index + 1 }}</span
          >
        </div>
      </div>
    </div>
    <div class="footer" @click="addPage">
      <div class="footer-text">
        <span class="iconfont icon-tianjia"></span> 新建分页
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pageContainer {
  width: 330px;
  height: 100%;
  position: relative;
  .header {
    height: 58px;
    display: flex;
    padding: 0px 24px 0px 16px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    &-text {
      font-size: 18px;
    }
    .icon-cuowuguanbiquxiao {
      font-size: 16px;
      cursor: pointer;
    }
  }
  .body {
    height: calc(100vh - 110px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    .page-list {
      .page-item {
        position: relative;
        width: 270px;
        height: 150px;
        border: 1px solid #e5e5e5;
        border-radius: 4px;
        margin-top: 20px;
        margin-bottom: 10px;
        &-text {
          position: absolute;
          left: 8px;
          bottom: 8px;
          font-size: 13px;
        }
        .more-action {
          position: absolute;
          height: 16px;
          width: 22px;
          top: 6px;
          right: 8px;
          background-color: #b2b2b2;
          border-radius: 2px;
          .icon-gengduo {
            color: #fff;
            position: absolute;
            margin-left: 3px;
          }
        }
      }
      .selected {
        border-color: #3456ff;
      }
    }
  }
  .body::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .footer {
    height: 52px;
    border-top: 1px solid #f0f0f0;
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 0;
    cursor: pointer;
    &-text {
      line-height: 52px;
    }
  }
}
</style>
