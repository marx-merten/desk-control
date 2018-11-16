import { EventEmitter } from "events";
import { DeckConfig } from "../../deckConfig";
import { DataUtil } from "../../utility";
import { IDeckButton, KeyCoordinates } from "../deckButton";
import { IDeckPage, KEY_CLICK, KEY_DOWN, KEY_UP } from "../deckStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "../deckWrapper";

export class SimpleDeckPage extends EventEmitter implements IDeckPage {
  public name: string;
  public deck?: StreamDeckWrapper;
  public buttons = new Array<IDeckButton | undefined>(DeckConfig.numberOfButtons);

  constructor(name: string) {
    super();
    this.name = name;

    this.on(KEY_DOWN, (key: StreamKeyWrapper) => {
      const b = this.buttons[key.keyIndex];
      if (b !== undefined) {
        b.emit(KEY_DOWN, key);
      }
    });
    this.on(KEY_UP, (key: StreamKeyWrapper) => {
      const b = this.buttons[key.keyIndex];
      if (b !== undefined) {
        b.emit(KEY_UP, key);
      }
    });
    this.on(KEY_CLICK, (key: StreamKeyWrapper) => {
      const b = this.buttons[key.keyIndex];
      if (b !== undefined) {
        b.emit(KEY_CLICK, key);
      }
    });
  }

  public activate(deck: StreamDeckWrapper) {
    this.deck = deck;
    this.buttons.forEach((button, i: number) => {
      if (button !== undefined) {
        button.activate(this.deck!.getKeyWrapper(i));
      }
    });
    this.redrawAll();
  }

  public deactivate(): void {
    this.deck = undefined;
    this.buttons.forEach((button, i: number) => {
      if (button !== undefined) {
        button.deActivate();
      }
    });
  }

  public get isActive(): boolean {
    return this.deck !== undefined;
  }

  public addButton(button: IDeckButton, pos?: KeyCoordinates): IDeckButton {
    if (pos !== undefined) {
      this.buttons[this.getButtonIndex(pos)] = button;
      if (this.isActive) {
        button.activate(this.deck!.getKeyWrapper(this.getButtonIndex(pos)));
      }
    } else {
      emptyLoop: for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 5; x++) {
          const p = this.getButtonIndex({ x, y });
          const b = this.buttons[p];
          if (b === undefined) {
            console.log("Found " + x + "." + y);
            this.buttons[p] = button;
            if (this.isActive) {
              button.activate(this.deck!.getKeyWrapper(p));
            }
            break emptyLoop;
          }
        }
      }
    }
    return button;
  }

  public removeButton(pos: KeyCoordinates): this {
    const b = this.buttons[this.getButtonIndex(pos)];
    this.buttons[this.getButtonIndex(pos)] = undefined;
    if (b !== undefined) {
      b.deActivate();
    }
    return this;
  }

  public clear(): this {
    this.buttons.forEach((button) => {
      if (button !== undefined) {
        button.deActivate();
      }
    });
    this.buttons = new Array(DeckConfig.numberOfButtons);
    return this;
  }

  public redrawAll() {
    this.buttons.forEach((button, index: number) => {
      if (button !== undefined) {
        button.draw();
      }
    });
  }
  private getButtonIndex(pos: KeyCoordinates): number {
    const base = (pos.y + 1) * 5 - 1;
    const value = base - pos.x;
    if (value < 0 || value > 14) {
      throw new Error("Incorrect postion " + pos.x + " / " + pos.y);
    } else {
      return value;
    }
  }
}
