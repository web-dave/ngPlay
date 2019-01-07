import { Color } from "./color";

export class Block {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    private ctx: CanvasRenderingContext2D,
    public color = new Color(),
    public radius: number = null
  ) {}

  Intersects(shape: Block) {
    let offset = 0;
    if (shape.radius != null) {
      offset = shape.radius;
    }

    if (
      this.Contains(shape.x - offset, shape.y - offset) ||
      this.Contains(shape.x + shape.width - offset, shape.y - offset) ||
      this.Contains(shape.x - offset, shape.y + shape.height - offset) ||
      this.Contains(
        shape.x + shape.width - offset,
        shape.y + shape.height - offset
      )
    ) {
      return true;
    } else if (
      shape.Contains(this.x - offset, this.y - offset) ||
      shape.Contains(this.x + this.width - offset, this.y - offset) ||
      shape.Contains(this.x - offset, this.y + this.height - offset) ||
      shape.Contains(
        this.x + this.width - offset,
        this.y + this.height - offset
      )
    ) {
      return true;
    }

    return false;
  }

  Contains(x: number, y: number) {
    if (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  Draw() {
    this.ctx.fillStyle = this.color.ToStandard();
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
