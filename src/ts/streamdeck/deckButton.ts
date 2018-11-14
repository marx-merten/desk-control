// tslint:disable:max-classes-per-file
import { EventEmitter } from "events";
import { DataUtil } from "../utility";
import { DeckButtonLabel } from "./deckButtonLabel";
import { IDeckPage } from "./deckStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deckWrapper";

export interface IDeckButton extends EventEmitter {
  readonly state: string;
  page?: IDeckPage;
  active: boolean;
  activate(deck: StreamKeyWrapper): void;
  deActivate(): void;
  draw(): void;
  markDirty(): void;
}

export class KeyCoordinates {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class DeckButton extends EventEmitter implements IDeckButton {
  public page?: IDeckPage;
  public deckKey?: StreamKeyWrapper;
  private deckLabel: DeckButtonLabel;

  constructor(lbl: DeckButtonLabel) {
    super();
    this.deckLabel = lbl;
  }

  set label(lbl: DeckButtonLabel) {
    this.deckLabel = lbl;
  }
  get label() {
    return this.deckLabel;
  }

  public activate(key: StreamKeyWrapper): void {
    this.deckKey = key;
  }
  public deActivate(): void {
    this.deckKey = undefined;
  }

  get active(): boolean {
    return this.deckKey !== undefined;
  }

  public get state(): string {
    return "";
  }
  public draw(): void {
    this.deckLabel.draw(this.deckKey!);
  }

  public markDirty() {
    if (this.active) {
      this.draw();
    }
  }
}
