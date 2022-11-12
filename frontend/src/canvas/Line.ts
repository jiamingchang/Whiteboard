import { fabric } from "fabric";
let line: any;
export class Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  constructor(opt: any) {
    this.x1 = opt.x1 || 0;
    this.y1 = opt.y1 || 0;
    this.x2 = opt.x2 || 0;
    this.y2 = opt.y2 || 0;
  }
  init(canvas: any, x1: number, y1: number) {
    this.x1 = x1;
    this.y1 = y1;
    line = new fabric.Line([x1, y1, x1, y1], {
      stroke: "#000",
      strokeWidth: 2,
    });
    canvas.add(line);
  }
  move(canvas: any, x2: number, y2: number) {
    this.x2 = x2;
    this.y2 = y2;
    line.set("x2", x2);
    line.set("y2", y2);
    canvas.requestRenderAll();
  }
  end() {
    line = null;
  }
}
