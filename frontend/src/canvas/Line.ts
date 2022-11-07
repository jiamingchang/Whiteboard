import { fabric } from "fabric";
let line: any = null;
export class Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  constructor(opt: any) {
    this.startX = opt.startX || 0;
    this.startY = opt.startY || 0;
    this.endX = opt.endX || 0;
    this.endY = opt.endY || 0;
  }
  init(canvas: any, x: number, y: number) {
    this.startX = this.endX = x;
    this.startY = this.endY = y;
    line = new fabric.Line([x, y, x, y]);
    canvas.add(line);
  }
  move(canvas: any, x: number, y: number) {
    line.set("x2", x);
    line.set("y2", y);

    canvas.requestRenderAll();
  }
  end() {
    if (line) {
      // 创建圆形（其实是把圆形边框的颜色改成 #000
      line.set("stroke", "#000");
    }
    line = null;
  }
}
