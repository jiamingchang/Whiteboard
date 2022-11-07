import { fabric } from "fabric";
export class Text {
  text: string;
  left: number;
  top: number;
  padding: number;
  constructor(opt: any) {
    this.text = opt.text || "";
    this.left = opt.left || 0;
    this.top = opt.top || 0;
    this.padding = opt.padding || 0;
  }
  render(canvas: any) {
    const textBox: any = new fabric.IText(this.text, {
      left: this.left,
      top: this.top,
      padding: this.padding,
    });
    canvas.add(textBox);
    textBox.splitByGrapheme = true;
    textBox.enterEditing();
  }
}
