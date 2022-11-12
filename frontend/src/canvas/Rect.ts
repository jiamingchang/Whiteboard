import { fabric } from "fabric";
let Rect: any;
export class Rectangle {
  constructor() {}
  init(canvas: any, x1: number, y1: number) {
    Rect = new fabric.Rect({
      left: x1,
      top: y1,
      fill: "transparent",
      stroke: "rgba(0, 0, 0, 0.5)",
      strokeWidth: 2,
    });
    canvas.add(Rect);
  }
  move(canvas: any, width: number, height: number) {
    Rect.set("width", width);
    Rect.set("height", height);
    canvas.requestRenderAll();
  }
  end() {
    Rect = null;
  }
}
