import { fabric } from "fabric";
let currentTriangle: any;
export class Triangle {
  constructor() {}
  init(canvas: any, x: number, y: number) {
    currentTriangle = new fabric.Triangle({
      left: x,
      top: y,
      fill: "transparent",
      stroke: "rgba(0, 0, 0, 0.5)",
      width: 0,
      height: 0,
    });
    canvas.add(currentTriangle);
  }
  move(canvas: any, width: number, height: number) {
    currentTriangle.set("width", width);
    currentTriangle.set("height", height);
    canvas.requestRenderAll();
  }
  end() {
    currentTriangle = null;
  }
}
