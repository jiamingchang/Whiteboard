<script setup lang="ts">
  import Canvas from "./Canvas.vue";
  import { computed, ref, watch } from "vue";
  import store from "@/store";
  import { useRouter } from "vue-router";
  import { StorageKey } from "@/store/state";
  import { useEyeDropper } from "@vueuse/core";
  import { useAnimationPageWidth } from "@/utils/hooks";
  import { useFullscreen } from "@vueuse/core";
  import { toolbarOptions } from "@/enum/toolbar";
  import { ElMessage } from "element-plus";

  const router = useRouter();
  const uid = ref(sessionStorage.getItem(StorageKey.UID));

  // 全屏
  const { isFullscreen, toggle } = useFullscreen();
  // 着色器
  const { isSupported, open, sRGBHex } = useEyeDropper();
  let pageWidth = computed(() => store.state.pageWidth);
  let isclick = computed(() => (pageWidth.value === 0 ? false : true));
  let currentType = computed(() => store.state.currentType);
  let toggleWidth = useAnimationPageWidth();

  // 当前缩放值
  let scale = ref(1);

  let currpage = computed(() => store.state.page + 1);
  let totalCount = computed(() => store.state.pageList.length);
  let toolbarData = ref(toolbarOptions);
  const selectActionHandle = (type: string) => {
    store.commit("changeCurrentType", type);
    if (isSupported && type === "shaders") {
      open();
    }
  };

  const handleCopy = () => {
    let inputDom = document.createElement('input');
    inputDom.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
    inputDom.value = sessionStorage.getItem(StorageKey.UID);
    document.body.appendChild(inputDom);
    inputDom.select();
    document.execCommand('Copy'); // 复制api
    inputDom.style.display = 'none';
    inputDom.remove();
    ElMessage('房间号复制成功');
  };

  watch(
    () => sRGBHex.value,
    (val) => {
      console.log(val);
    }
  );

  // 放大
  const zoomIn = () => {
    if (scale.value >= 3) {
      scale.value = 3;
    } else scale.value += 0.1;
  };

  // 缩小
  const zoomOut = () => {
    if (scale.value <= 0.1) {
      scale.value = 0.1;
    } else scale.value -= 0.1;
  };
</script>

<template>
  <div class="boardContainer">
    <Canvas :scale="scale" />
    <div class="top-action" :style="{
        left: pageWidth + 'px',
      }">
      <div class="top-action-left">
        <div class="iconfont icon-tuichu" @click="router.go(-1)"></div>
        <div class="info" @click="handleCopy">房间号：{{ uid }}</div>
        <div class="iconfont icon-fuzhi" @click="handleCopy"></div>
      </div>
    </div>
    <div class="toolbar" :style="{
        left: pageWidth + 'px',
      }">
      <div class="toolbar-item" v-for="item in toolbarData" :key="item.key" @click="selectActionHandle(item.type)">
        <el-tooltip class="box-item" :content="item.tips" placement="right-start">
          <div :class="[item.iconClass, item.type === currentType ? 'active' : '']"></div>
        </el-tooltip>
      </div>
    </div>
    <div class="left-action" :style="{
        left: pageWidth + 'px',
      }">
      <div :class="['left-action-left', isclick ? 'selected' : '']" @click="toggleWidth">
        {{ currpage }} / {{ totalCount }}
      </div>
      <!-- 拓展 -->
      <div class="left-action-right"></div>
    </div>
    <div class="right-action">
      <div class="right-action-items">
        <div class="right-action-item iconfont icon-jian" @click="zoomOut"></div>
        <div class="right-action-item">
          {{ parseInt(String(100 * scale)) }}%
        </div>
        <div class="right-action-item iconfont icon-tianjia" @click="zoomIn"></div>
        <div :class="[
            'right-action-item',
            'iconfont',
            isFullscreen ? 'icon-guanbiquanping' : 'icon-quanping',
          ]" @click="toggle"></div>
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

    .box-item {
      color: #fff;
    }

    .bgImg {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .canvasBox {
      position: relative;
    }

    .toolbar {
      position: fixed;
      top: 90px;
      transition: left 0.5s linear;
      margin-left: 12px;
      background: #fff;
      padding: 10px;
      box-shadow: 0 2px 10px rgb(0 0 0 / 3%);

      &-item {
        margin: 4px 0;
        padding: 5px;
        border-radius: 4px;
      }

      &-item:hover {
        background: #f7f7f7;
      }

      .iconfont {
        font-size: 28px;
      }

      .active {
        color: #3456ff;
      }
    }

    .top-action {
      position: fixed;
      top: 8px;
      transition: left 0.5s linear;
      display: flex;

      &-left {
        background: #fff;
        display: flex;
        padding: 10px 20px;
        align-items: center;
        margin-left: 12px;
        height: 20px;
        box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
        cursor: pointer;
      }

      .icon-tuichu {
        font-size: 20px;
      }

      .info {
        margin-left: 10px;
      }

      .icon-fuzhi {
        margin-left: 5px;
      }
    }

    .left-action {
      position: fixed;
      bottom: 12px;
      transition: left 0.5s linear;

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