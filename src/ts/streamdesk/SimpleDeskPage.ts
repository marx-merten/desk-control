import { EventEmitter } from "events";
import { StreamDeckWrapper } from "./deskWrapper";
import { IDeskPage } from "./deskstack";
export class SimpleDeskPage extends EventEmitter implements IDeskPage {
  name: string;
  deck?: StreamDeckWrapper;
  constructor(name: string) {
    super();
    this.name = name;
  }
  activate(deck: StreamDeckWrapper) {
    this.deck = deck;
    this.deck.fillColor(2, 110, 230, 100);
  }
}
