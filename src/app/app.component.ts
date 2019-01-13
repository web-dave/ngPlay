import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Observable, interval, Subscription } from "rxjs";
import { GameService } from "./game.service";
import { bufferCount } from "rxjs/operators";
import { Block, Player, Color } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  // @ViewChild("canvas") _canvas;
  canvas: HTMLCanvasElement;
  width = 1024;
  height = 768;
  ctx: CanvasRenderingContext2D;
  floor: Block[] = [];
  player: Player;
  progress: string;
  touch = { active: false, startX: 0, startY: 0, endX: 0, endY: 0 };
  pressedKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Space: false
  };

  stats = {
    shots: 0,
    hits: 0,
    lost: [],
    hurt: 0
  };
  statsMax = {
    shots: 100,
    hits: 100,
    lost: 10,
    hurt: 3
  };
  events: string[] = [
    "keydown",
    "keyup",
    "touchstart",
    "touchend",
    "touchmove"
  ];
  obsArr: Observable<any>[] = [];
  $tick: Observable<number> = interval(10);
  $keyDown: Observable<KeyboardEvent>;
  $keyUp: Observable<KeyboardEvent>;
  $touchStart: Observable<TouchEvent>;
  $touchEnd: Observable<TouchEvent>;
  $touchMove: Observable<TouchEvent>;
  subscription = new Subscription();

  constructor(private service: GameService) {}
  ngAfterViewInit() {}
  go(c) {
    this.canvas = c;
    this.ctx = this.canvas.getContext("2d");
    this.obsArr = this.service.createObsovables(
      this.canvas.offsetParent,
      this.events
    );
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.initGame();
  }

  initGame() {
    this.player = new Player(this.canvas, this.ctx);
    this.floor = [];
    const b = new Block(
      0,
      this.canvas.height - 10,
      this.canvas.width,
      20,
      this.ctx,
      new Color("rgb", 0, 153, 51, 1)
    );
    this.floor.push(b);
    // const b1 = new Block(0, 738, 20, 20, this.ctx, new Color("saddlebrown"));
    this.floor.push(
      new Block(0, 738, 20, 20, this.ctx, new Color("saddlebrown"))
    );
    this.floor.push(
      new Block(0, 718, 20, 20, this.ctx, new Color("saddlebrown"))
    );
    this.floor.push(
      new Block(20, 738, 20, 20, this.ctx, new Color("saddlebrown"))
    );
    this.start();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.floor.forEach(e => e.Draw());
    this.player.Update(this.pressedKeys);

    this.progress = this.service.getProgress(
      this.stats.shots,
      this.statsMax.shots
    );
    let collided = true;
    this.floor.forEach((e, ei) => {
      this.player.bullets.forEach((b, bi) => {
        if (b.obj.Intersects(e)) {
          this.player.bullets.splice(bi, 1);
          if (e.removable) {
            this.floor.splice(ei, 1);
            this.service.handleStats(
              "hits",
              this.stats,
              this.statsMax,
              this.subscription
            );
          }
        }
      });
      if (e.Intersects(this.player.rect)) {
        this.player.SetPosition(null, e.y - this.player.rect.height);
        this.player.jumpAvailable = true;
        collided = true;
      }
      // this.floor.forEach((block, i) => {
      //   if (block.Intersects(e)) {
      //     // if (ei >= 2 && i === 0) {
      //     if (ei !== 0 && i === 0) {
      //       this.floor.splice(ei, 1);
      //       this.service.handleStats(
      //         "lost",
      //         this.stats,
      //         this.statsMax,
      //         this.subscription
      //       );
      //     }
      //   }
      // });
    });

    if (!collided) {
      this.player.jumpAvailable = false;
    }

    this.player.Draw();
  }

  keyD(e: string) {
    if (e === "Space") {
      this.service.handleStats(
        "shots",
        this.stats,
        this.statsMax,
        this.subscription
      );
    }
    this.pressedKeys[e] = true;
  }
  keyU(e: string) {
    this.pressedKeys[e] = false;
  }

  fps(obs: Observable<number>) {
    this.subscription.add(obs.subscribe(() => this.draw()));

    // this.subscription.add(
    //   obs
    //     .pipe(bufferCount(50))
    //     .subscribe(n =>
    //       this.service.moveBlocks(
    //         this.floor,
    //         this.player,
    //         this.stats,
    //         this.statsMax,
    //         this.subscription
    //       )
    //     )
    // );
    // this.subscription.add(
    //   obs
    //     .pipe(bufferCount(150))
    //     .subscribe(n =>
    //       this.service.createBlocks(this.floor, this.ctx, this.width)
    //     )
    // );
  }

  start() {
    this.fps(<Observable<number>>this.obsArr[0]);
    this.subscription.add(this.obsArr[1].subscribe(e => this.keyD(e.code)));
    this.subscription.add(this.obsArr[2].subscribe(e => this.keyU(e.code)));

    this.subscription.add(
      this.obsArr[3].subscribe(e =>
        this.handleTouch(e.changedTouches[0], "touchstart")
      )
    );
    this.subscription.add(
      this.obsArr[4].subscribe(e =>
        this.handleTouch(e.changedTouches[0], "touchend")
      )
    );
  }

  handleTouch(e: Touch, evt: string) {
    this.touch.active = evt === "touchstart";
    if (evt === "touchstart") {
      this.touch.startX = e.clientX;
      this.touch.startY = e.clientY;
    } else {
      this.touch.endX = e.clientX;
      this.touch.endY = e.clientY;
      if (this.touch.startX - this.touch.endX <= -10) {
        this.keyD("ArrowRight");
      } else if (this.touch.startX - this.touch.endX >= 10) {
        this.keyD("ArrowLeft");
      } else {
        this.keyD("Space");
      }
      setTimeout(() => {
        this.keyU("Space");
        this.keyU("ArrowLeft");
        this.keyU("ArrowRight");
      }, 150);
    }
  }
}
