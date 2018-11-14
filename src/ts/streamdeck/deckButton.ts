import { EventEmitter } from "events";
import { IDeckPage } from "./deckStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deckWrapper";

export interface IDeckButton extends EventEmitter {
  readonly state: string;
  page?: IDeckPage;
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
