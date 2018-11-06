import { EventEmitter } from "events";
import { DataUtil } from "../utility";
import { IDeskPage } from "./deskstack";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deskWrapper";

export interface IDeskButton extends EventEmitter {
  readonly state: string;
  page?: IDeskPage;
  show(deck: StreamKeyWrapper): void;
}

export class KeyCoordinates {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class DeskButton extends EventEmitter implements IDeskButton {
  public get state(): string {
    return "HH";
  }
  public page?: IDeskPage;
  public show(deck: StreamKeyWrapper): void {
    deck.fillColor(
      DataUtil.random(0, 255),
      DataUtil.random(0, 255),
      DataUtil.random(0, 255),
    );
  }
}
