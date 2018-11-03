import { DataUtil } from "./utility";
import { resolve } from "path";
const StreamDeck = require("elgato-stream-deck");

const myStreamDeck = new StreamDeck();

myStreamDeck.on("down", (keyIndex: number) => {
  console.log("key %d down", keyIndex);
  const r = Math.random() * 255;
  const g = Math.random() * 255;
  const b = Math.random() * 255;

  console.log("Color Random (%d,%d,%d)", r, g, b);
  myStreamDeck.fillColor(keyIndex, r, g, b);
});

myStreamDeck.on("up", (keyIndex: number) => {
  const imagePath = resolve(__dirname, "../src/res/gh.png");
  myStreamDeck.fillImageFromFile(keyIndex, imagePath).then(() => {
    console.log("Image Added");
  });
});

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on("error", (error: any) => {
  console.error(error);
});

export class Tester {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

console.log("TESTER");
myStreamDeck.clearAllKeys();
const keys = DataUtil.range(0, 14);

var color = [90, 90, 90];
keys.forEach(key => {
  myStreamDeck.fillColor(key, color[0], color[1], color[2]);
});

color = [90, 190, 90];
keys.forEach(key => {
  myStreamDeck.fillColor(key, color[0], color[1], color[2]);
});
color = [190, 90, 90];
keys.forEach(key => {
  myStreamDeck.fillColor(key, color[0], color[1], color[2]);
});

console.log(DataUtil.range(0, 14));

const s = new Tester("kkj");
