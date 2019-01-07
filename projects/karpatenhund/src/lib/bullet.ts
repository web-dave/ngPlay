import { Block } from "./block";
import { Vector } from "./vector";

export class Bullet {
  constructor(private velocity: Vector, public obj: Block) {}
  Update() {
    this.obj.x += this.velocity.x;
    this.obj.y += this.velocity.y;
  }

  Draw() {
    this.obj.Draw();
  }
}
