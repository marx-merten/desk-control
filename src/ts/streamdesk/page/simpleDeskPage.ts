import { EventEmitter } from "events";
import { DeskConfig } from "../../deckConfig";
import { IDeskPage } from "../deskstack";
import { KEY_CLICK, KEY_DOWN } from "../deskStack";
import { StreamDeckWrapper, StreamKeyWrapper } from "../deskWrapper";
import { IDeskButton, KeyCoordinates } from "../streamdeckButton";

export class SimpleDeskPage extends EventEmitter implements IDeskPage {
  public name: string;
  public deck?: StreamDeckWrapper;
  public keys = new Array<IDeskButton>(DeskConfig.numberOfButtons);

  constructor(name: string) {
    super();
    this.name = name;

    this.on(KEY_CLICK, (key: StreamKeyWrapper) => {
      // tslint:disable-next-line:no-console
      console.log(key.keyIndex);
    });
  }
  public activate(deck: StreamDeckWrapper) {
    this.deck = deck;
    this.deck.fillColor(2, 110, 230, 100);
  }

  public addButton(pos?: KeyCoordinates): SimpleDeskPage {
    return this;
  }
}
