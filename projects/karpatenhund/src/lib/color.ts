export class Color {
  constructor(
    public name: string,
    public r = 255,
    public g = 255,
    public b = 255,
    public a = 1
  ) {}

  ToStandard(noAlpha = false) {
    if (this.name === "rgb") {
      if (!noAlpha) {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
      } else {
        return `rgb(${this.r},${this.g},${this.b})`;
      }
    } else {
      return this.name;
    }
  }
}
