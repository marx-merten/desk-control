import { Color, get as colorGet, to as colorTo } from "color-string";
import { main } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { CharacterLabel, SvgLabel } from "./streamdeck/page/svgLabel";

const deck = new DeckStack();
const page = new SimpleDeckPage("MAIN");
const l = new CharacterLabel("D", undefined, true);
l.background = colorGet("darkgrey")!.value;
page.addButton(
  new SimpleButton("next", l).on(KEY_CLICK, (key: any) => {
    deck.jumpPage("DEMO1");
  }),
  { x: 4, y: 0 },
);
main(deck);
deck.addPage(page);
deck.setMainPage("MAIN");

// tslint:disable-next-line:no-console
const logger = setInterval(() => {
  logPrecache();
}, 1000);

function logPrecache() {
  // tslint:disable-next-line:no-console
  console.log("Caching:" + SvgLabel.precacheInFlight);
  if (SvgLabel.precacheInFlight === 0) {
    // tslint:disable-next-line:no-console
    console.log("Deck Started, please press ctrl + c to stop operations !!!");
    clearInterval(logger);
  }
}
