import { EventEmitter } from "events";
import { IDeskPage } from "./deskStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deskWrapper";

export interface IDeskButton extends EventEmitter {
  readonly state: string;
  page?: IDeskPage;
  activate(deck: StreamKeyWrapper): void;
  deActivate(): void;
  draw(): void;
}

export class KeyCoordinates {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
