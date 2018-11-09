import { EventEmitter } from "events";
import { DataUtil } from "../../utility";
import { IDeskButton } from "../deskButton";
import { IDeskPage } from "../deskstack";
import { StreamDeckWrapper, StreamKeyWrapper } from "../deskWrapper";

export class DeskButton extends EventEmitter implements IDeskButton {
  public page?: IDeskPage;
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
export class SimpleButton extends DeskButton {
  public name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }

  get state(): string {
    return this.name;
  }
}
