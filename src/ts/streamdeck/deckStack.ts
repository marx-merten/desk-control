import { strict } from "assert";
import { EventEmitter } from "events";
import { DeckConfig } from "../deckConfig";
import { DataUtil } from "../utility";
import { IDeckButton, KeyCoordinates } from "./deckButton";
import { StreamDeckWrapper, StreamKeyWrapper } from "./deckWrapper";
// tslint:disable-next-line:no-var-requires
const StreamDeck = require("elgato-stream-deck");

export const BUTTON_RANGE = DataUtil.range(0, 14);
export const KEY_DOWN = "keyDown";
export const KEY_UP = "keyUp";
export const KEY_CLICK = "keyClick";

export class DeckStack {
  get currentFrame(): IDeckPage {
    if (this.currentStack.length < 1) {
      throw new Error("No Pages defined");
    } else {
      return this.currentStack[this.currentStack.length - 1];
    }
  }
  public deck: StreamDeckWrapper;
  public mainPage?: IDeckPage;
  public pages: { [id: string]: IDeckPage } = {};
  private drawRetry: number = 0;

  private currentStack: IDeckPage[] = [];
  private buttonTimings = new Array<number>(DeckConfig.numberOfButtons);

  constructor() {
    this.deck = new StreamDeckWrapper(new StreamDeck(), this);
    this.deck.deck.on("down", (key: number) => {
      this.eventDown(key);
    });
    this.deck.deck.on("up", (key: number) => {
      this.eventup(key);
    });
    this.deck.deck.on("error", (error: any) => {
      // tslint:disable-next-line:no-console
      console.log("Error: " + error);
    });
  }

  // Main Key Handle, redirect to active Page and Key if necessary.
  // --------------------------------------------------------------

  public eventDown(key: number): any {
    this.currentFrame.emit(KEY_DOWN, this.deck.getKeyWrapper(key));
    this.registerButtonPress(key);
  }
  public eventup(key: number): any {
    this.currentFrame.emit(KEY_UP, this.deck.getKeyWrapper(key));
    const pressDuration = this.registerButtonRelease(key);
    // tslint:disable-next-line:no-console
    if (pressDuration > DeckConfig.clickMinimumTimeMs) {
      this.currentFrame.emit(KEY_CLICK, this.deck.getKeyWrapper(key));
    }
  }

  public addPage(page: IDeckPage): DeckStack {
    this.pages[page.name] = page;
    return this;
  }

  public setMainPage(page: string | IDeckPage) {
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
    this.updateFrame();
  }
  public jumpPage(page: string): any {
    let resolvedPage;
    if (typeof page === "string") {
      resolvedPage = this.pages[page];
      if (resolvedPage === undefined) {
        throw new Error(" Couldnt find Page with ID: " + page);
      }
    } else {
      resolvedPage = page;
    }
    this.currentFrame.deactivate();
    this.currentStack.push(resolvedPage);
    this.updateFrame();
  }
  public returnToPrevious(): void {
    if (this.currentStack.length < 2) {
      return;
    } // do nothing because no subframe
    const current = this.currentStack.pop();
    current!.deactivate();
    this.updateFrame();
  }

  public returnTo(page: string): void {
    if (this.currentStack.length <= 1) {
      return;
    } // Do Nothing, Main Page

    let p = this.currentStack.pop()!;
    while (p.name !== page) {
      p.deactivate();
      if (this.currentStack.length === 0) {
        break;
      } else {
        p = this.currentStack.pop()!;
      }
    }
    this.currentStack.push(p);
    this.updateFrame();
  }

  private updateFrame() {
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
    try {
      // clear Deck and redraw using all fields and current stack page.
      this.deck.clearAllKeys();
      this.currentFrame.activate(this.deck);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log("Error cached, retry " + this.drawRetry++);
      if (this.drawRetry <= 10) {
        setTimeout(() => {
          this.redrawFull();
        }, 200);
      }
    }
  }
}

export interface IDeckPage extends EventEmitter {
  name: string;

  activate(deck: StreamDeckWrapper): void;
  deactivate(): void;

  addButton(button: IDeckButton, pos?: KeyCoordinates): IDeckButton;
  removeButton(pos: KeyCoordinates): this;
  redrawAll(): void;
  clear(): this;

  on(
    event: "keyDown" | "keyUp" | "keyClick",
    cb: (key: StreamKeyWrapper) => any,
  ): this;

  on(event: "ACTIVATED" | "DEACTIVATED", cb: () => any): this;
}
