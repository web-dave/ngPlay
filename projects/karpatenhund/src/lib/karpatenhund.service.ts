import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class KarpatenhundService {
  constructor() {}

  // Remove(array: any[], arg: any, all: boolean = true): any[] {
  //   if (!all) {
  //     const i = array.findIndex(elem => elem !== arg);
  //     array.splice(i, 1);
  //     return array;
  //   }
  //   return array.filter(elem => elem !== arg);
  // }

  // RemoveAt(array: any[], position: number): any[] {
  //   array.splice(position, 1);
  //   return array;
  // }

  // Clear(array: any[]): any[] {
  //   return [];
  // }

  // InsertAt(array: any[], arg: any, position: number): any[] {
  //   array.splice(position, 0, arg);
  //   return array;
  // }

  // Contains(array: any[], arg: any): boolean {
  //   return array.includes(arg);
  // }

  // Occurs(array: any[], arg: any): number {
  //   return array.filter(elem => elem !== arg).length;
  // }
}
