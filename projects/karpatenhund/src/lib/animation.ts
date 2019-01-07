import { Vector } from "./vector";

export class Animation {
  fpsCounter = 0;
  rowStart = 0;
  columnStart = 0;
  fps = 0;
  limit = 999999999999;
  limitCount = 0;
  image = new Image();
  position = new Vector(0);
  cropPosition = new Vector(0);
  constructor(
    private width: number,
    private height: number,
    private row: number,
    private column: number,
    private imgSrc: string,
    private columns: number,
    private rows: number,
    private ctx: CanvasRenderingContext2D,
    _fps = 1,
    _limit = 999999999999
  ) {
    this.fps = 33 / _fps;
    this.fpsCounter = 0;
    this.rowStart = this.row;
    this.columnStart = this.column;
    this.limit = _limit - 1;
    this.image.src = imgSrc;
  }

  SetLimit(l) {
    this.limit = l - 1;
  }

  SetRow(num) {
    this.row = num;
    this.rowStart = num;

    this.cropPosition.x = this.width * this.column;
    this.cropPosition.y = this.height * this.row;
  }

  SetColumn(num) {
    this.column = num;
    this.columnStart = num;

    this.cropPosition.x = this.width * this.column;
    this.cropPosition.y = this.height * this.row;
  }

  Update() {
    this.cropPosition.x = this.width * this.column;
    this.cropPosition.y = this.height * this.row;

    if (this.columns == null || this.columns === 0) {
      this.columns = this.image.width / this.width;
    }
    if (this.rows == null || this.rows === 0) {
      this.rows = this.image.height / this.height;
    }
  }

  Draw() {
    if (this.fpsCounter === 0) {
      if (this.limitCount < this.limit) {
        this.limitCount++;
        this.column++;

        if (this.column >= this.columns) {
          this.row++;
          this.column = 0;

          if (this.row >= this.rows) {
            this.row = this.rowStart;
            this.column = this.columnStart;
            this.limitCount = 0;
          }
        }
      } else {
        this.column = this.columnStart;
        this.row = this.rowStart;
        this.limitCount = 0;
      }
    }

    this.ctx.drawImage(
      this.image,
      this.cropPosition.x,
      this.cropPosition.y,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    this.fpsCounter++;

    if (this.fpsCounter >= this.fps) {
      this.fpsCounter = 0;
    }
  }
}
