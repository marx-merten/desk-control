import { DeckStack } from "./deckStack";

// tslint:disable-next-line:no-var-requires
const StreamDeck = require("elgato-stream-deck");

export class StreamDeckWrapper {
  public deck: any;
  public stack: DeckStack;
  constructor(deck: any, stack: DeckStack) {
    this.deck = deck;
    this.stack = stack;
  }

  // Fill Color on  Button
  public fillColor(keyIndex: number, r = 0, g = 0, b = 0) {
    this.deck.fillColor(keyIndex, r, g, b);
  }

  // Reads a image from file and rersize to fit button Size
  public fillImageFromFile(keyIndex: number, filename: string) {
    this.deck.fillImageFromFile(keyIndex, filename);
  }

  // Reads Image from Buffer and directly writs to key, need to be scaled correctly
  public fillImage(keyIndex: number, imageBuffer: [number]) {
    this.deck.fillImage(keyIndex, imageBuffer);
  }

  public fillPanel(pathOrBuffer: Buffer | String, sharpOptions: Object) {
    this.deck.fillPaner(pathOrBuffer, sharpOptions);
  }

  public clearKey(keyIndex: number) {
    this.deck.clearKey(keyIndex);
  }

  public clearAllKeys() {
    this.deck.clearAllKeys();
  }

  public setBrightness(percentage: number) {
    this.deck.setBrightness(percentage);
  }

  public getKeyWrapper(key: number, stack?: DeckStack): StreamKeyWrapper {
    return new StreamKeyWrapper(this, key, stack);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class StreamKeyWrapper {
  public keyIndex: number;
  public deck: StreamDeckWrapper;
  public stack: DeckStack;
  constructor(deck: StreamDeckWrapper, keyIndex: number, stack?: DeckStack) {
    this.deck = deck;
    this.keyIndex = keyIndex;
    if (stack !== undefined) {
      this.stack = stack;
    } else {
      this.stack = deck.stack;
    }
  }

  // Fill Color on Button
  public fillColor(r = 0, g = 0, b = 0) {
    this.deck.fillColor(this.keyIndex, r, g, b);
  }

  // Reads a image from file and rersize to fit button Size
  public fillImageFromFile(filename: string) {
    this.deck.fillImageFromFile(this.keyIndex, filename);
  }

  // Reads Image from Buffer and directly writs to key, need to be scaled correctly
  public fillImage(imageBuffer: [number]) {
    this.deck.fillImage(this.keyIndex, imageBuffer);
  }

  public clearKey() {
    this.deck.clearKey(this.keyIndex);
  }
}
