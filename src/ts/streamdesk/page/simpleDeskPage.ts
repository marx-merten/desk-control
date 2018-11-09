import { EventEmitter } from "events";
import { DeskConfig } from "../../deckConfig";
import { IDeskButton, KeyCoordinates } from "../deskButton";
import { IDeskPage } from "../deskStack";
import { KEY_CLICK, KEY_DOWN } from "../deskStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "../deskWrapper";

export class SimpleDeskPage extends EventEmitter implements IDeskPage {
  public name: string;
  public deck?: StreamDeckWrapper;
  public buttons = new Array<IDeskButton | undefined>(DeskConfig.numberOfButtons);

  constructor(name: string) {
    super();
    this.name = name;

    this.on(KEY_CLICK, (key: StreamKeyWrapper) => {
      // tslint:disable-next-line:no-console
      console.log(key.keyIndex);
      const b = this.buttons[key.keyIndex];
      if (b !== undefined) {
        // tslint:disable-next-line:no-console
        console.log(b.state);
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
  }

  public get isActive(): boolean {
    return this.deck !== undefined;
  }

  public addButton(button: IDeskButton, pos?: KeyCoordinates): this {
    if (pos !== undefined) {
      this.buttons[this.getButtonIndex(pos)] = button;
      if (this.isActive) {
        button.activate(this.deck!.getKeyWrapper(this.getButtonIndex(pos)));
      }
    }
    return this;
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
    this.buttons = new Array(DeskConfig.numberOfButtons);
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
