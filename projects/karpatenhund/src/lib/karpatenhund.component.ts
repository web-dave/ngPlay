import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { fromEvent, Observable, interval, Subscription } from "rxjs";
import { last, bufferCount } from "rxjs/operators";

import { Block } from "./block";
import { Player } from "./player";
import { Color } from "./color";

@Component({
  selector: "kph-karpatenhund",
  template: `
    <canvas
      #canvas
      (keydown)="keyD($event)"
      (keyup)="keyU($event)"
      id="canvas"
      [width]="width"
      [height]="height"
      style="border: 1px solid black;"
    ></canvas>
    <table>
      <tr>
        <td>Shots:</td>
        <td><div class="progress-circle" [title]="getProgress()"></div></td>
      </tr>
      <tr>
        <td>Hits:</td>
        <td>{{ stats.hits }}</td>
      </tr>
      <tr>
        <td *ngIf="stats.hurt === 0">❤️❤️❤️</td>
        <td *ngIf="stats.hurt === 1">❤️❤️🖤</td>
        <td *ngIf="stats.hurt === 2">❤️🖤🖤</td>
        <td *ngIf="stats.hurt === 3">🖤🖤🖤</td>
      </tr>
      <tr>
        <td *ngIf="stats.lost === 1">💧</td>
        <td *ngIf="stats.lost === 2">️💧💧</td>
        <td *ngIf="stats.lost === 3">💧💧💧</td>
      </tr>
    </table>
  `,
  styles: [
    `
      * {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        background-color: #fff;
        overflow: hidden;
        height: 100%;
      }
    `
  ]
})
export class KarpatenhundComponent implements OnInit, AfterViewInit {
  @ViewChild("canvas") _canvas;
  canvas: HTMLCanvasElement;
  width = 1000;
  height = 500;
  ctx: CanvasRenderingContext2D;
  floor: Block[] = [];
  player: Player;
  pressedKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Space: false
  };

  stats = {
    shots: 0,
    hits: 0,
    lost: 0,
    hurt: 0
  };
  statsMax = {
    shots: 200,
    hits: 200,
    lost: 3,
    hurt: 3
  };

  $tick: Observable<number> = interval(10);
  $keyDown: Observable<KeyboardEvent>;
  $keyUp: Observable<KeyboardEvent>;
  subscribtion: Subscription;

  constructor() {}
  ngOnInit() {}
  ngAfterViewInit() {
    this.canvas = this._canvas.nativeElement;
    console.log(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.$keyDown = <Observable<KeyboardEvent>>(
      fromEvent(this.canvas.offsetParent, "keydown")
    );
    this.$keyUp = <Observable<KeyboardEvent>>(
      fromEvent(this.canvas.offsetParent, "keyup")
    );

    this.canvas.width = this.canvas.offsetParent.clientWidth;
    this.canvas.height = this.canvas.offsetParent.clientHeight;
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    this.initGame();
  }

  initGame() {
    // this.width = this.canvas.width;
    // this.height = this.canvas.height;
    this.player = new Player(this.canvas, this.ctx);
    this.floor = [];
    const b = new Block(
      0,
      this.canvas.height - 10,
      this.canvas.width,
      20,
      this.ctx,
      new Color(0, 153, 51, 1)
    );
    this.floor.push(b);
    // const b1 = new Block(820, 420, 120, 20, this.ctx);
    // b1.color = new Color(0, 255, 0, 1);
    // this.floor.push(b1);
    this.start();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.floor.forEach(e => e.Draw());
    this.player.Update(this.pressedKeys);

    let collided = true;
    this.floor.forEach((e, ei) => {
      this.player.bullets.forEach((b, bi) => {
        if (b.obj.Intersects(e)) {
          // console.log(b, e, "treffer", bi, ei);
          this.player.bullets.splice(bi, 1);
          this.floor.splice(ei, 1);
          this.handleStats("hits");
        }
      });
      if (e.Intersects(this.player.rect)) {
        this.player.SetPosition(null, e.y - this.player.rect.height);
        this.player.jumpAvailable = true;
        collided = true;
      }
      this.floor.forEach((block, i) => {
        if (block.Intersects(e)) {
          // if (ei >= 2 && i === 0) {
          if (ei !== 0 && i === 0) {
            // console.error("einen Stein verlohren", this.floor.length);
            this.floor.splice(ei, 1);
            this.handleStats("lost");
          }
        }
      });
    });

    if (!collided) {
      this.player.jumpAvailable = false;
    }

    this.player.Draw();
  }

  keyD(e: string) {
    if (e === "Space") {
      this.handleStats("shots");
    }
    this.pressedKeys[e] = true;
  }
  keyU(e: string) {
    this.pressedKeys[e] = false;
  }

  start() {
    this.subscribtion = this.$tick.subscribe(() => this.draw());
    this.subscribtion.add(this.$keyDown.subscribe(e => this.keyD(e.code)));
    this.subscribtion.add(this.$keyUp.subscribe(e => this.keyU(e.code)));

    this.subscribtion.add(
      this.$tick.pipe(bufferCount(50)).subscribe(n => this.moveBlocks())
    );
    this.subscribtion.add(
      this.$tick.pipe(bufferCount(150)).subscribe(n => this.createBlocks())
    );
  }
  moveBlocks() {
    this.floor.forEach((e, i) => {
      // if (i >= 2) {
      if (i !== 0) {
        e.y = e.y + 10;
        if (e.Intersects(this.player.rect)) {
          // console.error(e, "getroffen vom Block", ei);
          this.handleStats("hurt");
        }
      }
    });
  }

  createBlocks() {
    const b = new Block(
      Math.round(Math.random() * (this.width - 30 - 0)) + 0,
      0,
      10,
      10,
      this.ctx,
      new Color(0, 206, 209, 1)
    );
    this.floor.push(b);
  }
  handleStats(stat: string) {
    this.stats[stat]++;
    if (this.stats[stat] >= this.statsMax[stat]) {
      this.subscribtion.unsubscribe();
    }
  }
  getProgress() {
    const perc = Math.round((100 / this.statsMax.shots) * this.stats.shots);
    return `data-progress_${perc}`;
  }
}
