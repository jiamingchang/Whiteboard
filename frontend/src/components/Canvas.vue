<script setup lang="ts">
import { useMouse, useMousePressed } from "@vueuse/core";
import { ref, onMounted, watch } from "vue";
import { Rectangle } from "@/canvas/type";
import store from "@/store";
import { computed } from "@vue/reactivity";

const canvas = ref();
const container = ref();
const { x, y } = useMouse();
const { pressed } = useMousePressed({ target: canvas });

let currentType = computed(() => store.state.currentType);

let ctx: any = null;
let mouseDownX = 0;
let mouseDownY = 0;
let w = 0;
let h = 0;
let activeElement: any = null;
let allElements: any = [];

const initCanvas = () => {
  const { width, height } = container.value.getBoundingClientRect();
  w = width;
  h = height;
  canvas.value.width = width;
  canvas.value.height = height;
  ctx = canvas.value.getContext("2d");
  // 将画布的原点由左上角移动到中心点
  ctx.translate(canvas.value.width / 2, canvas.value.height / 2);
};

// 检测是否击中了某个元素
const checkIsHitElement = (x: number, y: number) => {
  let hitElement = null;
  // 从后往前遍历元素，即默认认为新的元素在更上层
  for (let i = allElements.length - 1; i >= 0; i--) {
    if (allElements[i].isHit(x, y)) {
      hitElement = allElements[i];
      break;
    }
  }
  if (hitElement) {
    alert("击中了矩形");
  }
};

const clearCanvas = () => {
  let width = canvas.value.width;
  let height = canvas.value.height;
  ctx.clearRect(-width / 2, -height / 2, width, height);
};

const renderAllElements = () => {
  clearCanvas(); // ++
  allElements.forEach((element: any) => {
    element.render(ctx, w, h);
  });
};
watch(
  () => [],
  () => {}
);
watch(
  () => pressed.value,
  (val) => {
    // 按住的逻辑
    if (val) {
      mouseDownX = x.value;
      mouseDownY = y.value;
      if (currentType.value === "selection") {
        // 选择模式下进行元素激活检测
        checkIsHitElement(mouseDownX, mouseDownY);
      }
    } else {
      mouseDownX = 0;
      mouseDownY = 0;
      activeElement = null;
    }
  }
);

watch(
  () => [x.value, y.value],
  () => {
    // 松开的逻辑
    if (!pressed.value || currentType.value === "selection") {
      return;
    }
    // 矩形不存在就先创建一个
    if (!activeElement) {
      activeElement = new Rectangle({
        x: mouseDownX,
        y: mouseDownY,
      });
      // 加入元素大家庭
      allElements.push(activeElement);
    }
    console.log(allElements);
    // 更新矩形的大小
    activeElement.width = x.value - mouseDownX;
    activeElement.height = y.value - mouseDownY;
    // 渲染所有的元素
    renderAllElements();
  }
);

onMounted(() => {
  initCanvas();
});
</script>

<template>
  <div class="canvasConatiner" ref="container">
    <canvas class="box" ref="canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
.canvasConatiner {
  width: 100%;
  height: 100%;
  background-image: url("img/grid.svg");
  .box {
    width: 100%;
    height: 100%;
  }
}
</style>
