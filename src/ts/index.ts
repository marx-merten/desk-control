import sharp = require("sharp");
import { DeskStack } from "./streamdesk/deskstack";
import { StreamDeckWrapper } from "./streamdesk/deskWrapper";
import { SimpleDeskPage } from "./streamdesk/SimpleDeskPage";

import * as fs from "fs";
import * as path from "path";

// tslint:disable-next-line:no-var-requires
const StreamDeck = require("elgato-stream-deck-clean");

const deck = new DeskStack();

deck.addPage(new SimpleDeskPage("MAIN"));
deck.setMainPage("MAIN");

// tslint:disable-next-line:no-console
console.log("READY Press ctrl+c to stop operations !!!");

const dd = deck.desk;
dd.clearAllKeys();
dd.fillColor(0, 222, 133, 222);

let xvg = `<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect id="Rectangle" fill="####COLOR###" x="3" y="3" width="66" height="66" rx="9"></rect>
    <text id="Jks" font-family="monospace" font-size="14" font-weight="normal" fill="#000000">
        <tspan x="10" y="63">###TXT###</tspan>
    </text>
    <image id="home" x="15" y="7" width="42" height="40" xlink:href="###PNG###"></image>
</g>
</svg>`;

function convertToBase64(filename: string): string {
  const data = fs.readFileSync(path.resolve("./src/res/home.png"));
  return data.toString("base64");
}

xvg = xvg
  .replace(
    "###PNG###",
    "data:image/png;base64," + convertToBase64("./src/res/home.png"),
  )
  .replace("###TXT###", "Master")
  .replace("###COLOR###", "EF34EE");

const im = sharp(Buffer.from(xvg));

im.resize(StreamDeck.ICON_SIZE, StreamDeck.ICON_SIZE)
  .flatten()
  .raw()
  .toBuffer()
  .then((buffer) => {
    return deck.desk.fillImage(8, buffer);
  });
