import { Injectable } from "@angular/core";
import { Subscription, interval, Observable, fromEvent } from "rxjs";

import { Color } from "./color";
import { Block } from "./block";
import { Player } from "./player";

export interface Evt {
  code?: string;
  i?: number;
  changedTouches?: Touch[];
}

@Injectable({
  providedIn: "root"
})
export class KarpatenhundService {
  constructor() {}

  createObsovables(elem: Element, events: string[]): Observable<Evt>[] {
    return [
      <Observable<Evt>>interval(10),
      ...events.map(e => <Observable<Evt>>fromEvent(elem, e))
    ];
  }

  moveBlocks(
    floor: Block[],
    player: Player,
    stats,
    statsMax,
    subscription: Subscription
  ) {
    floor.forEach((e, i) => {
      // if (i >= 2) {
      if (i !== 0) {
        e.y = e.y + 10;
        if (e.Intersects(player.rect)) {
          this.handleStats("hurt", stats, statsMax, subscription);
        }
      }
    });
  }

  createBlocks(floor: Block[], ctx: CanvasRenderingContext2D, width: number) {
    const b = new Block(
      Math.round(Math.random() * (width - 30 - 0)) + 0,
      0,
      10,
      10,
      ctx,
      new Color(0, 206, 209, 1)
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
