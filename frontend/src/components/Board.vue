<script setup lang="ts">
import Canvas from "./Canvas.vue";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useEyeDropper } from "@vueuse/core";
import { useAnimationPageWidth } from "@/utils/hooks";
import { useFullscreen } from "@vueuse/core";
import { toolbarOptions } from "@/enum/toolbar";
import { shapeOptions } from "@/enum/shape";
import { useRouter } from "vue-router";
import { StorageKey } from "@/store/state";
import { AskRoom, getRoom } from "@/service";
import { ElMessage } from "element-plus";
import store from "@/store";

const router = useRouter();
const uid = ref(sessionStorage.getItem(StorageKey.UID));
const canvas = ref();

// 是否房主
let isRoomer = computed(() => store.state.isRoomer);

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

// 是否悬浮形状
let isHover = ref(false);

// 是否只读
let isReadOnly = computed(() => store.state.isReadOnly);

watch(
  () => isReadOnly.value,
  (val) => {
    console.log("42行，当前的isReadOnly", val);
  }
);

// 对用户：请求协作确认框
let userVisible = ref(false);

// 对房主：是否有协作请求
let isAcceptRequest = ref(false);

let currpage = computed(() => store.state.page + 1);
let totalCount = computed(() => store.state.pageList.length);
let toolbarData = ref(toolbarOptions);
let shapeData = ref(shapeOptions);

onBeforeMount(() => {
  getRoom(uid.value as string)
    .then((res) => {
      const userid = sessionStorage.getItem("userid");
      if ((res.data as any).who_add == userid) {
        store.commit("saveIsRoomer", true);
      }
      if ((res.data as any).read_only == 1) {
        store.commit("changeIsReadOnly", true);
      } else {
        store.commit("changeIsReadOnly", false);
      }
    })
    .catch((err) => {
      router.push("/");
    });
});

const selectActionHandle = (type: string) => {
  store.commit("changeCurrentType", type);
  if (isSupported && type === "shaders") {
    open();
  }
};

const handleCopy = () => {
  let inputDom: any = document.createElement("input");
  inputDom.setAttribute("readonly", "readonly"); // 防止手机上弹出软键盘
  inputDom.value = sessionStorage.getItem(StorageKey.UID);
  document.body.appendChild(inputDom);
  inputDom.select();
  document.execCommand("Copy"); // 复制api
  inputDom.style.display = "none";
  inputDom.remove();
  ElMessage("房间号复制成功");
};

// 撤回
const withdraw = () => {
  canvas.value.tapHistoryBtn(-1, "withdraw");
};

// 还原
const reduction = () => {
  canvas.value.tapHistoryBtn(1, "reduction");
};

// 判断是否是房主，房主切换逻辑
const roomerSwitch = () => {
  console.log("请求。。。。xxxx");
  userVisible.value = true;
};

// 用户：请求切换协作模式
const switchMode = async () => {
  await AskRoom({ read_only: isReadOnly.value ? 2 : 1 });
  // store.commit("changeIsReadOnly", isReadOnly.value ? false : true);
  userVisible.value = false;
};

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

const clearSrceen = () => {
  canvas.value.clearSrceen();
};

const mouseMoveHandle = (type: string) => {
  if (["shape", "rectangle", "circle"].includes(type)) {
    isHover.value = true;
  }
};

let timer: any;
const mouseLeaveHanle = () => {
  if (timer) {
    clearTimeout(timer);
  }
  setTimeout(() => {
    isHover.value = false;
  }, 500);
};

const changeShape = (type: string) => {
  const data = shapeData.value.find((item) => item.type === type);
  console.log(type, data);
  (toolbarData.value as any)[1] = {
    ...data,
    key: 2,
  };
  store.commit("changeCurrentType", type);
};

// 点击上传文件
const handleUpload = (e: any) => {
  canvas.value.setImage(e);
};
</script>

<template>
  <div class="boardContainer">
    <Canvas :scale="scale" ref="canvas" :isReadOnly="isReadOnly" />
    <div
      class="top-action"
      :style="{
        left: pageWidth + 'px',
      }"
    >
      <div class="top-action-item">
        <div class="iconfont icon-tuichu" @click="router.go(-1)"></div>
        <div class="info" @click="handleCopy">房间号：{{ uid }}</div>
        <div class="iconfont icon-fuzhi" @click="handleCopy"></div>
      </div>
      <div class="top-action-item" v-if="!isReadOnly || isRoomer">
        <div class="iconfont icon-huanyuan" @click="withdraw"></div>
        <div class="iconfont icon-huanyuan-01" @click="reduction"></div>
        <div class="iconfont icon-qingping" @click="clearSrceen"></div>
      </div>

      <!-- 只读模式按钮 -->
      <div class="mode" v-show="!isRoomer">
        <el-button class="top-button" @click="roomerSwitch"
          >{{ isReadOnly ? "只读" : "协作" }}模式
        </el-button>
      </div>

      <el-dialog v-model="userVisible" title="提示" width="30%" align-center>
        <span>确认向房主发送协作请求吗？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="userVisible = false">取消</el-button>
            <el-button type="primary" @click="switchMode"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <div class="right-show">
      <span> 着色器：</span>
      <div
        :style="{ background: sRGBHex ? sRGBHex : '#fff' }"
        class="right-show-item"
      ></div>
    </div>

    <!-- 向房主发送协作请求 弹窗 -->
    <el-dialog v-model="isAcceptRequest" title="Tips" width="30%" align-center>
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isAcceptRequest = false">Cancel</el-button>
          <el-button type="primary" @click="isAcceptRequest = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
    <div
      class="toolbar"
      :style="{
        left: pageWidth + 'px',
      }"
    >
      <div
        :class="['toolbar-item', isRoomer || !isReadOnly ? '' : 'read_only']"
        v-for="item in toolbarData"
        :key="item.key"
        @click="(!isReadOnly || isRoomer) && selectActionHandle(item.type)"
      >
        <el-tooltip
          class="box-item"
          :content="item.tips"
          placement="right-start"
        >
          <div
            :class="[
              item.iconClass,
              item.type === currentType && (!isReadOnly || isRoomer)
                ? 'active'
                : '',
            ]"
            @mousemove="(!isReadOnly || isRoomer) && mouseMoveHandle(item.type)"
          >
            <input
              type="file"
              class="input"
              @change="handleUpload"
              v-if="item.type === 'upload'"
              accept="image/*"
            />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div
      class="shape-action"
      @mousemove="!isReadOnly && mouseMoveHandle('shape')"
      @mouseleave="mouseLeaveHanle"
      v-if="isHover"
      :style="{
        left: pageWidth + 70 + 'px',
      }"
    >
      <div
        class="shape-action-item"
        v-for="item in shapeData"
        @click="(!isReadOnly || isRoomer) && changeShape(item.type)"
        :key="item.key"
      >
        <el-tooltip
          class="box-item"
          :content="item.tips"
          placement="right-start"
        >
          <div
            :class="[item.iconClass, item.type === currentType ? 'active' : '']"
          ></div>
        </el-tooltip>
      </div>
    </div>

    <div
      class="left-action"
      :style="{
        left: pageWidth + 'px',
      }"
    >
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
        <div
          class="right-action-item iconfont icon-jian"
          @click="zoomOut"
        ></div>
        <div class="right-action-item">
          {{ parseInt(String(100 * scale)) }}%
        </div>
        <div
          class="right-action-item iconfont icon-tianjia"
          @click="zoomIn"
        ></div>
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

  .icon-shangchuanwenjian {
    position: relative;
    overflow: hidden;
  }

  .input {
    z-index: 1;
    opacity: 0;
    left: 0;
    width: 100%;
    position: absolute;
  }

  .bgImg {
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

    .active {
      color: #3456ff;
    }
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

    .read_only {
      pointer-events: none;
      color: gray;
    }
  }

  .right-show {
    position: fixed;
    right: 12px;
    top: 6px;
    background: #fff;
    padding: 7px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 10px rgb(0 0 0 / 3%);

    &-item {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #fff;
      border: 1px solid #999;
    }
  }

  .shape-action {
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

    &-item {
      background: #fff;
      display: flex;
      padding: 10px 20px;
      align-items: center;
      margin-left: 12px;
      height: 20px;
      box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
      cursor: pointer;

      .iconfont {
        font-size: 20px;
      }

      .icon-huanyuan-01 {
        font-weight: 600;
        margin-left: 20px;
      }
      .icon-qingping {
        margin-left: 20px;
      }

      .iconfont:hover {
        color: #3456ff;
      }
    }

    .icon-tuichu {
      font-size: 20px;
    }

    .info {
      margin-left: 10px;
    }

    .icon-xinxikongxin {
      margin-left: 10px;
    }

    .mode {
      position: fixed;
      top: 7px;
      right: 120px;
      display: flex;
      align-items: center;

      .top-button {
        height: 35px;
        color: black;
        border-style: none;
        box-shadow: 0 2px 10px rgb(0 0 0 / 3%);
      }
    }
  }

  .left-action {
    position: fixed;
    bottom: 12px;
    transition: left 0.5s linear;

    &-left {
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
