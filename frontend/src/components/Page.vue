<script setup lang="ts">
import { useChangePageWidth } from "@/utils/hooks";
const close = useChangePageWidth();
</script>
<template>
  <div class="pageContainer">
    <div class="header">
      <div class="header-text">多页</div>
      <div
        class="iconfont icon-cuowuguanbiquxiao"
        @click="() => close(0)"
      ></div>
    </div>
    <div class="body"></div>
    <div class="footer">
      <span class="iconfont icon-tianjia"></span> 新建分页
    </div>
  </div>
</template>

<style scoped lang="scss">
.pageContainer {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .header {
    padding: 16px 16px 16px 24px;
    display: flex;
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
  }
  .footer {
    border-top: 1px solid #f0f0f0;
    position: absolute;
    width: 100%;
    padding: 20px 0;
    text-align: center;
    bottom: 0;
    cursor: pointer;
  }
}
</style>
