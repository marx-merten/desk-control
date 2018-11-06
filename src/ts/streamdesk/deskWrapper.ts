const StreamDeck = require("elgato-stream-deck-clean");

export class StreamDeckWrapper {
  public deck: any;
  constructor(deck: any) {
    this.deck = deck;
  }

  // Fill Color on Desk Button
  public fillColor(keyIndex: number, r = 0, g = 0, b = 0) {
    this.deck.fillColor(keyIndex, r, g, b);
  }

  // Reads a image from file and rersize to fit button Size
  public fillImageFromFile(keyIndex: number, filename: string) {
    this.deck.fillImageFromFile(keyIndex, filename);
  }

  // Reads Image from Buffer and directly writs to key, need to be scaled correctly
  public fillImage(keyIndex: number, imageBuffer: [number] | Buffer) {
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
}

export class StreamKeyWrapper {
  public keyIndex: number;
  public deck: any;
  constructor(deck: any, keyIndex: number) {
    this.deck = deck;
    this.keyIndex = keyIndex;
  }

  // Fill Color on Desk Button
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
