const screenToCanvas = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  return {
    x: x - width / 2,
    y: y - height / 2,
  };
};
// 计算点到直线的距离
const getPointToLineDistance = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  // 直线公式y=kx+b不适用于直线垂直于x轴的情况，所以对于直线垂直于x轴的情况单独处理
  if (x1 === x2) {
    return Math.abs(x - x1);
  } else {
    let k, b;
    // y1 = k * x1 + b  // 0式
    // b = y1 - k * x1  // 1式

    // y2 = k * x2 + b    // 2式
    // y2 = k * x2 + y1 - k * x1  // 1式代入2式
    // y2 - y1 = k * x2 - k * x1
    // y2 - y1 = k * (x2 -  x1)
    k = (y2 - y1) / (x2 - x1); // 3式

    b = y1 - k * x1; // 3式代入0式

    return Math.abs((k * x - y + b) / Math.sqrt(1 + k * k));
  }
};

// 检查是否点击到了一条线段
const checkIsAtSegment = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dis = 10
) => {
  // 点到直线的距离不满足直接返回
  if (getPointToLineDistance(x, y, x1, y1, x2, y2) > dis) {
    return false;
  }
  // 点到两个端点的距离
  let dis1 = getTowPointDistance(x, y, x1, y1);
  let dis2 = getTowPointDistance(x, y, x2, y2);
  // 线段两个端点的距离，也就是线段的长度
  let dis3 = getTowPointDistance(x1, y1, x2, y2);
  // 根据勾股定理计算斜边长度，也就是允许最远的距离
  let max = Math.sqrt(dis * dis + dis3 * dis3);
  // 点距离两个端点的距离都需要小于这个最远距离
  if (dis1 <= max && dis2 <= max) {
    return true;
  }
  return false;
};

// 计算两点之间的距离
const getTowPointDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
export class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(opt: any) {
    this.x = opt.x || 0;
    this.y = opt.y || 0;
    this.width = opt.width || 0;
    this.height = opt.height || 0;
  }
  // 检测是否被击中
  isHit(x0: number, y0: number) {
    let { x, y, width, height } = this;
    // 矩形四条边的线段
    let segments = [
      [x, y, x + width, y],
      [x + width, y, x + width, y + height],
      [x + width, y + height, x, y + height],
      [x, y + height, x, y],
    ];
    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i];
      if (
        checkIsAtSegment(x0, y0, segment[0], segment[1], segment[2], segment[3])
      ) {
        return true;
      }
    }
    return false;
  }

  render(ctx: any, width: number, height: number) {
    ctx.beginPath();
    // 屏幕坐标转成画布坐标
    let canvasPos = screenToCanvas(this.x, this.y, width, height);
    ctx.rect(canvasPos.x, canvasPos.y, this.width, this.height);
    ctx.stroke();
  }
}
