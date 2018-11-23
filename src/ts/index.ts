import { Color, get as colorGet, to as colorTo } from "color-string";
import { main } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { KVMPage } from "./streamdeck/homeDeck/kvmPage";
import { ICONS } from "./streamdeck/page/logos";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import {
  CharacterLabel,
  IconLabel,
  SvgLabel,
} from "./streamdeck/page/svgLabel";

const deck = new DeckStack();
const page = new SimpleDeckPage("MAIN");

// Add Sample Page and Demo Button

deck.addPage(page);
deck.setMainPage("MAIN");

// ---------------
//    Demo PAGE
// ---------------
main(deck);

// ---------------
//    KVM PAGE
// ---------------
deck.addPage(new KVMPage("kvm", deck));
page
  .addButton(new SimpleButton("kvm", new IconLabel(ICONS.KVM)), {
    x: 0,
    y: 0,
  })
  .jumpOnClick("kvm");

// ---------------------------
//    Logging cache success
// ---------------------------

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
