import { EventEmitter } from "events";
import { DataUtil } from "../../utility";
import { IDeckButton } from "../deckButton";
import { IDeckPage, KEY_CLICK } from "../deckStack";
import { StreamKeyWrapper } from "../deckWrapper";

export class DeckButton extends EventEmitter implements IDeckButton {
  public page?: IDeckPage;
  public deckKey?: StreamKeyWrapper;

  public activate(key: StreamKeyWrapper): void {
    this.deckKey = key;
  }
  public deActivate(): void {
    this.deckKey = undefined;
  }

  public get state(): string {
    return "";
  }
  public draw(): void {
    this.deckKey!.fillColor(DataUtil.random(0, 255), DataUtil.random(0, 255), DataUtil.random(0, 255));
  }
}

// tslint:disable-next-line:max-classes-per-file
export class SimpleButton extends DeckButton {
  public name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }

  get state(): string {
    return this.name;
  }
}
