import { Injectable } from "@angular/core";
import { Observable, interval, fromEvent, Subscription } from "rxjs";
import { Block, Player, Color } from "projects/karpatenhund/src/public_api";

@Injectable({
  providedIn: "root"
})
export class GameService {
  constructor() {}

  createObsovables(elem: Element, events: string[]): Observable<any>[] {
    return [
      <Observable<any>>interval(10),
      ...events.map(e => <Observable<any>>fromEvent(elem, e))
    ];
  }

  moveBlocks(
    floor: Block[],
    player: Player,
    stats,
    statsMax,
    subscription: Subscription
  ) {
    // floor.forEach((e, i) => {
    //   // if (i >= 2) {
    //   if (i !== 0) {
    //     e.y = e.y + 10;
    //     if (e.Intersects(player.rect)) {
    //       this.handleStats("hurt", stats, statsMax, subscription);
    //     }
    //   }
    // });
  }

  createBlocks(floor: Block[], ctx: CanvasRenderingContext2D, width: number) {
    const b = new Block(
      Math.round(Math.random() * (width - 30 - 0)) + 0,
      0,
      10,
      10,
      ctx,
      new Color("rgb", 0, 206, 209, 1)
    );
    floor.push(b);
  }

  getProgress(shots: number, max: number) {
    const perc = Math.round((100 / max) * shots);
    return `data-progress_${perc}`;
  }

  handleStats(stat: string, stats, statsMax, subscription: Subscription) {
    if (stat !== "lost") {
      stats[stat]++;
      if (stats[stat] >= statsMax[stat]) {
        subscription.unsubscribe();
      }
    } else {
      stats.lost.push(0);
      if (stats[stat].length >= statsMax[stat]) {
        subscription.unsubscribe();
      }
    }
  }
}
