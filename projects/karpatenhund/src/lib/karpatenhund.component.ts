import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

@Component({
  selector: "kph-karpatenhund",
  template: `
    <canvas
      #canvas
      id="canvas"
      [width]="width"
      [height]="height"
      style="border: 1px solid black;"
    ></canvas>
  `
})
export class KarpatenhundComponent implements AfterViewInit {
  @ViewChild("canvas") _canvas;
  @Input() width = 1024;
  @Input() height = 768;
  @Output() go = new EventEmitter<HTMLCanvasElement>();
  canvas: HTMLCanvasElement;
  ngAfterViewInit() {
    this.canvas = this._canvas.nativeElement;
    of([0])
      .pipe(delay(1))
      .subscribe(() => this.go.emit(this.canvas));
  }
}
