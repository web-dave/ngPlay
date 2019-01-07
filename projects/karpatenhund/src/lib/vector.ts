export class Vector {
  x = 0;
  y = 0;
  previousX = 0;
  previousY = 0;

  constructor(x: number, y?: number) {
    if (!y) {
      y = x;
    }
  }

  Set(x: number, y: number): void {
    this.previousX = this.x;
    this.previousY = this.y;

    if (x != null && y == null) {
      this.x = x;
      this.y = y;
    } else {
      if (x != null) {
        this.x = x;
      }

      if (y != null) {
        this.y = y;
      }
    }
  }

  Move(vec2: Vector): void {
    this.x += vec2.x;
    this.y += vec2.y;
  }

  Normalize(): Vector {
    const helperVector = new Vector(this.x, this.y);

    const mag = Math.sqrt(
      helperVector.x * helperVector.x + helperVector.y * helperVector.y
    );
    helperVector.x = helperVector.x / mag;
    helperVector.y = helperVector.y / mag;

    return helperVector;
  }

  Distance(vec: Vector) {
    if (vec != null) {
      return Math.sqrt(
        (vec.x - this.x) * (vec.x - this.x) +
          (this.y - vec.y) * (this.y - vec.y)
      );
    } else {
      return Math.sqrt(
        (this.previousX - this.x) * (this.previousX - this.x) +
          (this.previousY - this.y) * (this.previousY - this.y)
      );
    }
  }

  HasChanged() {
    return this.x !== this.previousX || this.y !== this.previousY;
  }

  Difference(vec: Vector, invert = false) {
    let inv = 1;

    if (invert) {
      inv = -1;
    }

    if (vec == null) {
      return new Vector(
        (this.x - this.previousX) * inv,
        (this.y - this.previousY) * inv
      );
    } else {
      return new Vector((this.x - vec.x) * inv, (this.y - vec.y) * inv);
    }
  }
}
