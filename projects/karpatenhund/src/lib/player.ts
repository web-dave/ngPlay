import { Block } from "./block";
import { Animation } from "./animation";
import { Bullet } from "./bullet";
import { Vector } from "./vector";
import { Color } from "./color";

export class Player {
  animation: Animation;
  rect: Block;
  gravity = 1;

  moving = false;

  bullets: Bullet[] = [];
  shotBullet = false;
  lookinRight = true;

  jumpAvailable = false;
  jumping = false;
  JUMP_MAX = 0.6;
  jumpVelocity = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private size: number = 16
  ) {
    this.rect = new Block(
      (this.canvas.width - this.size) / 2,
      this.canvas.height - this.size * 2,
      size,
      size,
      this.ctx,
      new Color("rgb", 255, 0, 255, 1)
    );
    // this.rect.color.r = 0;
    // this.rect.color.g = 0;

    // this.animation = new Animation(size, size, 0, 0, imgSrc, 12, 4, this.ctx);
  }

  SetPosition(x: number, y: number, mod = false) {
    if (!mod) {
      if (x != null) {
        this.rect.x = x;
      }
      if (y != null) {
        this.rect.y = y;
      }
    } else {
      if (x != null) {
        this.rect.x += x;
      }
      if (y != null) {
        this.rect.y += y;
      }
    }
  }

  Update(input: {
    ArrowLeft: boolean;
    ArrowRight: boolean;
    ArrowUp: boolean;
    Space: boolean;
  }) {
    this.moving = false;

    if (input.ArrowLeft) {
      // this.animation.SetRow(2);
      this.rect.x -= 1;
      if (this.rect.x <= 0) {
        this.rect.x = 0;
      }
      this.moving = true;
      this.lookinRight = false;
    }
    if (input.ArrowRight) {
      // this.animation.SetRow(0);
      this.rect.x += 1;
      if (this.rect.x >= this.canvas.width - this.size) {
        this.rect.x = this.canvas.width - this.size;
      }
      this.moving = true;
      this.lookinRight = true;
    }
    if (input.ArrowUp) {
      this.Jump();
    }

    if (input.Space) {
      this.Shoot();
    } else {
      this.shotBullet = false;
    }

    this.UpdateBullets();

    if (this.jumping) {
      this.rect.y -= this.jumpVelocity;
      this.jumpVelocity -= 0.02;

      if (this.jumpVelocity <= 0) {
        this.jumping = false;
        this.jumpAvailable = true;
      }
    } else {
      this.rect.y += this.gravity;
    }

    // this.animation.position.Set(this.rect.x, this.rect.y);

    if (this.moving) {
      // this.animation.Update();
    } else {
      // this.animation.SetColumn(0);
    }
  }

  Shoot() {
    if (!this.shotBullet) {
      const b = new Block(
        this.rect.x + this.rect.width / 2 - 4,
        this.rect.y + this.rect.height / 2 - 4,
        8,
        8,
        this.ctx,
        new Color("rgb", 255, 0, 0, 1)
      );

      const vel = new Vector(0, 0);
      vel.x = this.lookinRight ? 3 : -3;

      const bul = new Bullet(vel, b);

      this.bullets.push(bul);

      this.shotBullet = true;
    }
  }

  UpdateBullets() {
    this.bullets.forEach((b: Bullet, i: number) => {
      b.Update();

      let done = false;
      if (b.obj.x + b.obj.width < 0) {
        done = true;
      } else if (b.obj.x > this.canvas.width) {
        done = true;
      }
      if (b.obj.y + b.obj.height < 0) {
        done = true;
      } else if (b.obj.y > this.canvas.height) {
        done = true;
      }

      if (done) {
        this.bullets.splice(i, 1);
      }
    });
  }

  Jump() {
    if (this.jumpAvailable) {
      this.jumpVelocity = this.JUMP_MAX;
      this.jumping = true;
      this.jumpAvailable = false;
    }
  }

  Draw() {
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].Draw();
    }
    this.rect.Draw();
    // this.animation.Draw();
  }
}
