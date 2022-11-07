<script setup lang="ts">
import { useMouse, useMousePressed } from "@vueuse/core";
import { ref, onMounted, watch, nextTick, computed, toRaw } from "vue";
import { fabric } from "fabric";
import { Circle } from "@/canvas/Circle";
import { Text } from "@/canvas/Text";
import { Line } from "@/canvas/Line";
import store from "@/store";

// 当前页面画布
let canvas: any = null; // 画布对象

let changeId: any = ref(0);
let canvas2: any = ref(null);
let page = computed(() => store.state.page);

let canvasString = computed(
  () => store.state.pageList[page.value].currpageData.canvasString
);

watch(
  () => canvasString.value,
  (val) => {
    canvas2.value.loadFromJSON(val);
  }
);

// 操作者监听画布改变，改变canvasString
watch(
  () => changeId.value,
  (val) => {
    if (val) {
      console.log(val);
      store.commit("changeCanvas", JSON.stringify(canvas));
    }
  },
  { deep: true }
);

let container = ref();

let curElement: any = null;

let currentType = computed(() => store.state.currentType); // 当前操作模式（默认 || 创建圆形）

let downPoint: any = null; // 按下鼠标时的坐标
let upPoint = null; // 松开鼠标时的坐标

// 初始化画板
function initCanvas() {
  const { width, height } = container.value.getBoundingClientRect();

  canvas = new fabric.Canvas("canvas", {
    width,
    height: height / 2,
  });

  canvas2.value = new fabric.Canvas("canvas2", {
    width,
    height: height / 2,
  });
  canvas.on("mouse:down", canvasMouseDown); // 鼠标在画布上按下
  canvas.on("mouse:move", canvasMouseMove); // 鼠标在画布上移动
  canvas.on("mouse:up", canvasMouseUp); // 鼠标在画布上松开
  canvas.on("object:moving", changeIdFn);
  canvas.on("object:rotating", changeIdFn);
  canvas.on("object:scaling", changeIdFn);
  canvas.on("selection:updated", (e: any) => {
    console.log(e.target);
  });
  canvas.on("selection:created", (e: any) => {
    console.log(e.target);
  });
}

function changeIdFn(e: any) {
  changeId.value = changeId.value + 1;
}

watch(
  () => currentType.value,
  (val) => {
    typeChange(val);
  }
);

// 画布操作类型切换
function typeChange(opt: any) {
  switch (opt) {
    case "selection": // 默认框选模式
      canvas.selection = true; // 允许框选
      canvas.selectionColor = "rgba(100, 100, 255, 0.3)"; // 选框填充色：半透明的蓝色
      canvas.selectionBorderColor = "rgba(255, 255, 255, 0.3)"; // 选框边框颜色：半透明灰色
      canvas.skipTargetFind = false; // 允许选中
      canvas.isDrawingMode = false;
      break;
    case "rectangle": // 创建矩形模式
      canvas.selectionColor = "transparent"; // 选框填充色：透明
      canvas.selectionBorderColor = "transparent"; // 选框边框颜色：透明度很低的黑色（看上去是灰色）
      canvas.skipTargetFind = true; // 禁止选中
      canvas.isDrawingMode = false;
      break;
    case "paint":
      canvas.isDrawingMode = true;
      canvas.selection = false;
      break;
    case "text":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      break;
    case "line":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      break;
    default:
      break;
  }
}

// 鼠标在画布上按下
function canvasMouseDown(e: any) {
  downPoint = e.absolutePointer;
  if (currentType.value === "rectangle") {
    // 使用 Fabric.js 提供的api创建圆形，此时圆形的半径是0
    curElement = new Circle({
      top: downPoint.y,
      left: downPoint.x,
      radius: 0,
      fill: "transparent",
      stroke: "rgba(0, 0, 0, 0.2)",
    });
    // 初始化
    curElement.init(canvas);
    changeId.value = changeId.value + 1;
  } else if (currentType.value === "text") {
    if (!e.target) {
      let textbox = new Text({
        text: "",
        left: downPoint.x,
        top: downPoint.y,
        padding: 7,
      });
      textbox.render(canvas);
      changeId.value = changeId.value + 1;
    }
  } else if (currentType.value === "line") {
    curElement = new Line({});
    curElement.init(canvas, downPoint.x, downPoint.y);
  }
}

// 鼠标在画布上移动
function canvasMouseMove(e: any) {
  const currentPoint = e.absolutePointer;
  if (currentType.value === "rectangle" && curElement) {
    // 半径：用短边来计算圆形的直径，最后除以2，得到圆形的半径
    let radius =
      Math.min(
        Math.abs(downPoint.x - currentPoint.x),
        Math.abs(downPoint.y - currentPoint.y)
      ) / 2;
    // 计算圆形的top和left坐标位置
    let top =
      currentPoint.y > downPoint.y ? downPoint.y : downPoint.y - radius * 2;
    let left =
      currentPoint.x > downPoint.x ? downPoint.x : downPoint.x - radius * 2;
    curElement.move(canvas, top, left, radius);
    changeId.value = changeId.value + 1;
  } else if (currentType.value === "paint") {
    // changeId.value = changeId.value + 1;
  } else if (currentType.value === "line" && curElement) {
    curElement.move(canvas, currentPoint.x, currentPoint.y);
  }
}

// 鼠标在画布上松开
function canvasMouseUp(e: any) {
  upPoint = e.absolutePointer;
  if (currentType.value === "rectangle") {
    curElement.up(canvas, downPoint, upPoint);
  } else if (currentType.value === "line") {
    curElement.end();
  }
  curElement = null;
  changeId.value = changeId.value + 1;
}

onMounted(() => {
  nextTick(() => {
    initCanvas();
  });
});
</script>

<template>
  <div class="canvasConatiner" ref="container">
    <canvas ref="canvasRef" id="canvas"></canvas>
    <canvas id="canvas2"></canvas>
  </div>
</template>

<style scoped lang="scss">
.canvasConatiner {
  width: 100%;
  height: 100%;
  background-image: url("img/grid.svg");
  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
