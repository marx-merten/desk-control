import { strict } from "assert";
import { EventEmitter } from "events";
import { DeskConfig } from "../deckConfig";
import { DataUtil } from "../utility";
import { IDeskButton, KeyCoordinates } from "./deskButton";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deskWrapper";
const StreamDeck = require("elgato-stream-deck");

export const BUTTON_RANGE = DataUtil.range(0, 14);
export const KEY_DOWN = "keyDown";
export const KEY_UP = "keyUp";
export const KEY_CLICK = "keyClick";

export class DeskStack {
  get currentFrame(): IDeskPage {
    if (this.currentStack.length < 1) {
      throw new Error("No Pages defined");
    } else {
      return this.currentStack[this.currentStack.length - 1];
    }
  }
  public desk: StreamDeckWrapper;
  public mainPage?: IDeskPage;
  public pages: { [id: string]: IDeskPage } = {};

  private currentStack: IDeskPage[] = [];
  private buttonTimings = new Array<number>(DeskConfig.numberOfButtons);

  constructor() {
    this.desk = new StreamDeckWrapper(new StreamDeck());
    this.desk.deck.on("down", (key: number) => {
      this.eventDown(key);
    });
    this.desk.deck.on("up", (key: number) => {
      this.eventup(key);
    });
    this.desk.deck.on("error", (error: any) => {
      // tslint:disable-next-line:no-console
      console.log("Error: " + error);
    });
  }

  // Main Key Handle, redirect to active Page and Key if necessary.
  // --------------------------------------------------------------

  public eventDown(key: number): any {
    this.currentFrame.emit(KEY_DOWN, this.desk.getKeyWrapper(key));
    this.registerButtonPress(key);
  }
  public eventup(key: number): any {
    this.currentFrame.emit(KEY_UP, this.desk.getKeyWrapper(key));
    const pressDuration = this.registerButtonRelease(key);
    // tslint:disable-next-line:no-console
    if (pressDuration > 10) {
      this.currentFrame.emit(KEY_CLICK, this.desk.getKeyWrapper(key));
    }
  }

  public addPage(page: IDeskPage): DeskStack {
    this.pages[page.name] = page;
    return this;
  }

  public setMainPage(page: string | IDeskPage) {
    let resolvedPage;
    if (typeof page === "string") {
      resolvedPage = this.pages[page];
      if (resolvedPage === undefined) {
        throw new Error(" Couldnt find Page with ID: " + page);
      }
    } else {
      resolvedPage = page;
    }

    this.currentStack = [resolvedPage];
    this.redrawFull();
    this.clearButtonTimings();
  }

  private registerButtonPress(key: number): void {
    this.buttonTimings[key] = Date.now();
  }
  private registerButtonRelease(key: number): number {
    const old = this.buttonTimings[key];
    this.buttonTimings[key] = -1;
    if (old !== undefined && old > 0) {
      return Date.now() - old;
    } else {
      return -1;
    }
  }
  private clearButtonTimings(): any {
    BUTTON_RANGE.forEach((val: number, index: number) => {
      this.buttonTimings[index] = -1;
    });
  }

  private redrawFull() {
    // clear desk and redraw using all fields and current stack page.
    this.desk.clearAllKeys();
    this.currentFrame.activate(this.desk);
  }
}

export interface IDeskPage extends EventEmitter {
  name: string;

  activate(deck: StreamDeckWrapper): void;
  deactivate(): void;

  addButton(button: IDeskButton, pos?: KeyCoordinates): this;
  removeButton(pos: KeyCoordinates): this;
  redrawAll(): void;
  clear(): this;
}
