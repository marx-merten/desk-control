const StreamDeck = require("elgato-stream-deck");

export class StreamDeckWrapper {
  deck: any;
  constructor(deck: any) {
    this.deck = deck;
  }

  // Fill Color on Desk Button
  fillColor(keyIndex: number, r = 0, g = 0, b = 0) {
    this.deck.fillColor(keyIndex, r, g, b);
  }

  // Reads a image from file and rersize to fit button Size
  fillImageFromFile(keyIndex: number, filename: string) {
    this.deck.fillImageFromFile(keyIndex, filename);
  }

  // Reads Image from Buffer and directly writs to key, need to be scaled correctly
  fillImage(keyIndex: number, imageBuffer: [number]) {
    this.deck.fillImage(keyIndex, imageBuffer);
  }

  fillPanel(pathOrBuffer: Buffer | String, sharpOptions: Object) {
    this.deck.fillPaner(pathOrBuffer, sharpOptions);
  }

  clearKey(keyIndex: number) {
    this.deck.clearKey(keyIndex);
  }

  clearAllKeys() {
    this.deck.clearAllKeys();
  }

  setBrightness(percentage: number) {
    this.deck.setBrightness(percentage);
  }
}

export class StreamKeyWrapper {
  keyIndex: number;
  deck: any;
  constructor(deck: any, keyIndex: number) {
    this.deck = deck;
    this.keyIndex = keyIndex;
  }

  // Fill Color on Desk Button
  fillColor(r = 0, g = 0, b = 0) {
    this.deck.fillColor(this.keyIndex, r, g, b);
  }

  // Reads a image from file and rersize to fit button Size
  fillImageFromFile(filename: string) {
    this.deck.fillImageFromFile(this.keyIndex, filename);
  }

  // Reads Image from Buffer and directly writs to key, need to be scaled correctly
  fillImage(imageBuffer: [number]) {
    this.deck.fillImage(this.keyIndex, imageBuffer);
  }

  clearKey() {
    this.deck.clearKey(this.keyIndex);
  }
}
