import { EventEmitter } from "events";
import { DataUtil } from "../../utility";
import { DeckButton, IDeckButton } from "../deckButton";
import { DeckButtonLabel } from "../deckButtonLabel";
import { IDeckPage, KEY_CLICK } from "../deckStack";
import { StreamKeyWrapper } from "../deckWrapper";
import { RandomColorLabel } from "./simpleLabels";

// tslint:disable-next-line:max-classes-per-file
export class SimpleButton extends DeckButton {
  public name: string;
  constructor(name: string, lbl?: DeckButtonLabel) {
    if (lbl !== undefined) {
      super(lbl);
    } else {
      super(new RandomColorLabel());
    }
    this.name = name;
  }

  public draw(): void {
    // console.log("DRAW:" + this.name);
    super.draw();
  }
  get state(): string {
    return this.name;
  }
}
