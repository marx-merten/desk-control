import { strict } from "assert";
import { EventEmitter } from "events";
import { DataUtil } from "../utility";
import { StreamDeckWrapper } from "./deskWrapper";
const StreamDeck = require("elgato-stream-deck");

const BUTTON_RANGE = DataUtil.range(0, 14);
export class DeskStack {
  desk: StreamDeckWrapper;
  constructor() {
    this.desk = new StreamDeckWrapper(new StreamDeck());
    this.desk.deck.on("down", (key: number) => {
      this.eventDown(key);
    });
    this.desk.deck.on("up", (key: number) => {
      this.eventup(key);
    });
    this.desk.deck.on("error", (error: any) => {
      console.log("Error: " + error);
    });
  }

  // Main Key Handle, redirect to active Page and Key if necessary.
  // --------------------------------------------------------------

  eventDown(key: number): any {
    console.log("Key pressed %d", key);
  }
  eventup(key: number): any {
    console.log("Key released %d", key);
  }

  private currentStack: Array<IDeskPage> = [];
  mainPage?: IDeskPage;
  pages: { [id: string]: IDeskPage } = {};

  addPage(page: IDeskPage): DeskStack {
    this.pages[page.name] = page;
    return this;
  }

  setMainPage(page: string | IDeskPage) {
    var resolvedPage;
    if (typeof page === "string") {
      resolvedPage = this.pages[page];
      if (resolvedPage == undefined)
        throw new Error(" Couldnt find Page with ID: " + page);
    } else {
      resolvedPage = page;
    }

    this.currentStack = [resolvedPage];
    this.redrawFull();
  }

  private redrawFull() {
    // clear desk and redraw using all fields and current stack page.
    this.desk.clearAllKeys;
    this.currentFrame().activate(this.desk);
  }
  currentFrame(): IDeskPage {
    if (this.currentStack.length < 1) throw new Error("No Pages defined");
    else return this.currentStack[this.currentStack.length - 1];
  }
}

export interface IDeskPage {
  name: string;

  activate(deck: StreamDeckWrapper): void;
}

export class SimpleDeskPage extends EventEmitter implements IDeskPage {
  name: string;
  deck?: StreamDeckWrapper;
  constructor(name: string) {
    super();
    this.name = name;
  }

  activate(deck: StreamDeckWrapper) {
    this.deck = deck;
    this.deck.fillColor(2, 0, 230, 100);
  }
}
