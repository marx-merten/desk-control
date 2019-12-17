// tslint:disable:max-classes-per-file
import { EventEmitter } from "events";
import { DataUtil } from "../utility";
import { DeckButtonLabel } from "./deckButtonLabel";
import { IDeckPage, KEY_CLICK, KEY_DOWN, KEY_UP } from "./deckStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deckWrapper";

export interface IDeckButton extends EventEmitter {
  readonly state: string;
  page?: IDeckPage;
  active: boolean;
  activate(deck: StreamKeyWrapper): void;
  deActivate(): void;
  draw(): void;
  markDirty(): void;
  jumpOnClick(page: string): this;

  on(
    event: "keyDown" | "keyUp" | "keyClick",
    cb: (key: StreamKeyWrapper) => any,
  ): this;
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
  private dirty = false;

  constructor(lbl: DeckButtonLabel) {
    super();
    this.deckLabel = lbl;
    this.deckLabel.button = this;
  }

  set label(lbl: DeckButtonLabel) {
    if (this.deckLabel !== undefined) {
      this.deckLabel.button = undefined;
    }
    this.deckLabel = lbl;
    this.deckLabel.button = this;
  }
  get label() {
    return this.deckLabel;
  }

  public activate(key: StreamKeyWrapper): void {
    this.deckKey = key;
    if (this.dirty) this.draw();
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
    this.dirty = false;
  }

  public markDirty() {
    this.dirty = true;
    if (this.active) {
      this.draw();
    }
  }
  public jumpOnClick(page: string): this {
    this.on(KEY_CLICK, (key: StreamKeyWrapper) => {
      key.stack.jumpPage(page);
    });
    return this;
  }
}
