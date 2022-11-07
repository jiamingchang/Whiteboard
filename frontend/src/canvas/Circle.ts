import { fabric } from "fabric";
let currentCircle: any;
export class Circle {
  top: number;
  left: number;
  radius: number;
  fill: string;
  stroke: string;

  constructor(opt: any) {
    this.top = opt.top || 0;
    this.left = opt.left || 0;
    this.radius = opt.radius || 0;
    this.fill = "transparent";
    this.stroke = "rgba(0, 0, 0, 0.4)";
  }

  public init(canvas: any) {
    currentCircle = new fabric.Circle({
      top: this.top,
      left: this.left,
      radius: this.radius,
      fill: this.fill,
      stroke: this.stroke,
    });
    canvas.add(currentCircle);
  }

  public move(canvas: any, top: number, left: number, radius: number) {
    // 分别设置圆形的半径、top和left

    this.left = left;
    this.top = top;
    this.radius = radius;

    currentCircle.set("top", top);
    currentCircle.set("left", left);
    currentCircle.set("radius", radius);

    canvas.requestRenderAll();
  }

  public up(canvas: any, downPoint: any, upPoint: any) {
    // 如果鼠标点击和松开是在同一个坐标，那就不会创建圆形（其实是把刚创建半径为0的圆形删掉）
    if (JSON.stringify(downPoint) === JSON.stringify(upPoint)) {
      canvas.remove(currentCircle);
    } else {
      if (currentCircle) {
        // 创建圆形（其实是把圆形边框的颜色改成 #000
        currentCircle.set("stroke", "#000");
      }
    }
    // 完成以上操作后，临时的圆形清空掉。
    currentCircle = null;
  }

  public render(canvas: any) {
    canvas.add(
      new fabric.Circle({
        top: this.top,
        left: this.left,
        radius: this.radius,
        fill: this.fill,
        stroke: this.stroke,
      })
    );
  }
}
