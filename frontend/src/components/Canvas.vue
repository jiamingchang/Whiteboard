<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { fabric } from "fabric";
import { Circle } from "@/canvas/Circle";
import { Rectangle } from "@/canvas/Rect";
import { Line } from "@/canvas/Line";
import store from "@/store";
import { ElMessage } from "element-plus";
import "@/libs/eraser_brush.mixin.js";

// 暴露给父组件的方法
defineExpose({
  tapHistoryBtn,
  setImage,
});

// 当前页面画布
let canvas: any = null; // 画布对象

let changeId: any = ref(0);

let page = computed(() => store.state.page);

let state = computed(() => store.state);

let canvasString = computed(() => {
  console.log("当前page：", page.value);
  return store.state.pageList[page.value].currpageData.canvasString;
});

watch(
  () => page.value,
  (val) => {
    if (canvasString.value) {
      canvas.renderAll();
      canvas.loadFromJSON(canvasString.value);
    } else {
      canvas.clear();
    }
  }
);

watch(
  () => state.value,
  () => {
    if (!textObj) {
      canvas.loadFromJSON(canvasString.value);
    }
  },
  { deep: true }
);

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
});

watch(
  () => props.scale,
  (val) => {
    canvas.setZoom(val);
    changeId.value = changeId.value + 1;
  }
);

//
function setImage(e: any) {
  // 上传文件列表的第一个文件
  const file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e: any) {
    const base64URL = e.target.result;
    fabric.Image.fromURL(
      base64URL,
      function (oImg) {
        // scale image down, and flip it, before adding it onto canvas
        oImg.scale(0.2).set("left", 100).set("top", 100);
        canvas.add(oImg);
      },
      { crossOrigin: "anonymous" }
    );
  };
  reader.readAsDataURL(file);
  // 设置画布背景，并刷新画布
  e.target.value = "";
}

// 操作者监听画布改变，改变canvasString
watch(
  () => changeId.value,
  (val) => {
    if (val) {
      // console.log(val);
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

let recordTimer: any;
let stateArr: Object[] = [];
let stateIdx = 0;
let stateType = "";

let isDragging = false;

// 初始化画板
function initCanvas() {
  const { width, height } = container.value.getBoundingClientRect();

  canvas = new fabric.Canvas("canvas", {
    width,
    height: height,
  });
  canvas.on("mouse:down", canvasMouseDown); // 鼠标在画布上按下
  canvas.on("mouse:move", canvasMouseMove); // 鼠标在画布上移动
  canvas.on("mouse:up", canvasMouseUp); // 鼠标在画布上松开
  canvas.on("after:render", (e: any) => {
    if (stateType !== "withdraw" && stateType !== "reduction") {
      if (recordTimer) {
        clearTimeout(recordTimer);
        recordTimer = null;
      }
      recordTimer = setTimeout(() => {
        stateArr.push(JSON.stringify(canvas));
        stateIdx++;
        stateType = "";
      }, 1000);
    }
  });
}

// 撤销 或 还原
function tapHistoryBtn(flag: number, type: string) {
  stateType = type;
  stateIdx = stateIdx + flag;
  console.log(stateIdx, stateArr.length);
  // 判断是否已经到了第一步操作
  if (stateIdx < 0) {
    stateIdx = -1;
    ElMessage.warning("已经到了第一步！");
    canvas.clear();
    return;
  }
  if (stateIdx == stateArr.length - 1 && type === "withdraw") {
    stateIdx = stateIdx - 1;
  }
  // 判断是否已经到了最后一步操作
  if (stateIdx >= stateArr.length) {
    ElMessage.warning("已经到最后一步！");
    return;
  }
  if (stateArr[stateIdx]) {
    console.log(stateArr[stateIdx]);
    canvas.loadFromJSON(stateArr[stateIdx]);
    if (canvas.getObjects().length > 0) {
      canvas.getObjects().forEach((item: any) => {
        item.set("selectable", false);
      });
    }
  }
  changeId.value = changeId.value + 1;
}

let textObj: any;

function drawText() {
  if (!textObj) {
    // 当前不存在绘制中的文本对象，鼠标第一次按下

    // 根据鼠标按下的起点坐标文本对象
    textObj = new fabric.Textbox("", {
      left: downPoint.x,
      top: downPoint.y,
      fontSize: 18,
      hasControls: false,
      editable: true,
      width: 100,
      backgroundColor: "#fff",
    });
    canvas.add(textObj);
    // 文本打开编辑模式
    textObj.enterEditing();
    // 文本编辑框获取焦点
    textObj.hiddenTextarea.focus();
  } else {
    // 鼠标第二次按下 将当前文本对象退出编辑模式
    textObj.exitEditing();
    textObj.set("backgroundColor", "rgba(0,0,0,0)");
    if (textObj.text == "") {
      canvas.remove(textObj);
    }
    console.log(canvas);
    canvas.renderAll();
    textObj = null;
    changeId.value = changeId.value + 1;
  }
}
// 监听改变type
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
      canvas.freeDrawingBrush.inverted = true;
      break;
    case "rectangle": // 创建矩形模式
    case "circle":
      canvas.selectionColor = "transparent"; // 选框填充色：透明
      canvas.selectionBorderColor = "transparent"; // 选框边框颜色：透明度很低的黑色（看上去是灰色）
      canvas.skipTargetFind = true; // 禁止选中
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.inverted = true;
      break;
    case "paint":
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 5;
      canvas.isDrawingMode = true;
      break;
    case "text":
      canvas.isDrawingMode = false;
      canvas.freeDrawingBrush.inverted = true;
      break;
    case "line":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.freeDrawingBrush.inverted = true;
      break;
    case "eraser":
      // 启用自由绘画模式
      canvas.isDrawingMode = true;
      // 自由绘画模式 画笔类型设置为 橡皮擦对象
      canvas.freeDrawingBrush = new (fabric as any).EraserBrush(canvas);
      // 设置橡皮擦大小
      canvas.freeDrawingBrush.width = 8;
      break;
    case "grab":
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.freeDrawingBrush.inverted = true;
      break;
    default:
      break;
  }
}

// 鼠标在画布上按下
function canvasMouseDown(e: any) {
  downPoint = e.absolutePointer;
  if (currentType.value === "circle") {
    // 使用 Fabric.js 提供的api创建圆形，此时圆形的半径是0
    curElement = new Circle({
      top: downPoint.y,
      left: downPoint.x,
      radius: 0,
      fill: "transparent",
      stroke: "rgba(0, 0, 0, 0.5)",
    });
    // 初始化
    curElement.init(canvas);
    changeId.value = changeId.value + 1;
  } else if (currentType.value === "text") {
    drawText();
  } else if (currentType.value === "line") {
    curElement = new Line({});
    curElement.init(canvas, downPoint.x, downPoint.y);
  } else if (currentType.value === "grab") {
    isDragging = true;
    canvas.selection = false;
  } else if (currentType.value === "rectangle") {
    curElement = new Rectangle();
    curElement.init(canvas, downPoint.x, downPoint.y);
  }
}

// 鼠标在画布上移动
function canvasMouseMove(e: any) {
  const currentPoint = e.absolutePointer;
  if (currentType.value === "circle" && curElement) {
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
  } else if (currentType.value === "text") {
    // changeId.value = changeId.value + 1;
  } else if (currentType.value === "line" && curElement) {
    curElement.move(canvas, currentPoint.x, currentPoint.y);
  } else if (currentType.value === "grab" && isDragging) {
    var opt = canvas.viewportTransform;
    opt[4] += currentPoint.x - downPoint.x;
    opt[5] += currentPoint.y - downPoint.y;
    canvas.requestRenderAll();
  } else if (currentType.value === "rectangle" && curElement) {
    curElement.move(
      canvas,
      currentPoint.x - downPoint.x,
      currentPoint.y - downPoint.y
    );
  }
}

// 鼠标在画布上松开
function canvasMouseUp(e: any) {
  upPoint = e.absolutePointer;
  if (currentType.value === "circle") {
    curElement.up(canvas, downPoint, upPoint);
  } else if (currentType.value === "line") {
    curElement.end();
  } else if (currentType.value === "grab") {
    isDragging = false;
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.selection = true;
  } else if (currentType.value === "rectangle") {
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
    <canvas ref="canvasRef" id="canvas" width="100%" height="100%"></canvas>
  </div>
</template>

<style scoped lang="scss">
.canvasConatiner {
  width: 100%;
  height: 100%;
  background-image: url("img/grid.svg");
}
</style>
