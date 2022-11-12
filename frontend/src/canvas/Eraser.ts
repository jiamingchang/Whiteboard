import { fabric } from "fabric";
import "@/libs/eraser_brush.mixin.js";
export class Eraser {
  constructor(canvas: any) {
    this.init(canvas);
  }
  init(canvas: any) {
    canvas.freeDrawingBrush = new (fabric as any).EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 4;
  }
}
