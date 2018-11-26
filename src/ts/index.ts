import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckConfig } from "./deckConfig";
import { main as demoMain } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { KVMPage } from "./streamdeck/homeDeck/kvmPage";
import { ICONS } from "./streamdeck/page/logos";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";
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
// demoMain(deck);

// ---------------
//    KVM PAGE
// ---------------
const kvm = new KVMPage("kvm", deck);
deck.addPage(kvm);
page
  .addButton(
    new SimpleButton(
      "kvm",
      new IconLabel(ICONS.KVM).setBackground(DeckConfig.colDefault),
    ),
    {
      x: 0,
      y: 0,
    },
  )
  .jumpOnClick("kvm");

// Favs Folder
// ---------------
const favs = new SubMenu("FAVS", deck);

favs
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "main")), {
    x: 0,
    y: 0,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 01");
    kvmApi.execute(() => {
      //
    });
  });

favs
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "laptop")), {
    x: 0,
    y: 1,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 02");
    kvmApi.execute(() => {
      //
    });
  });

deck.addPage(favs);
page
  .addButton(
    new SimpleButton("favs", new IconLabel(ICONS.FOLDER, "favorite")),
    { x: 4, y: 0 },
  )
  .jumpOnClick("FAVS");
// ---------------------------
//    Logging cache success
// ---------------------------

// tslint:disable-next-line:no-console
const logger = setInterval(() => {
  logPrecache();
}, 1000);

function logPrecache() {
  // tslint:disable-next-line:no-console
  console.log("Caching:" + SvgLabel.precacheInFlight.size);
  if (SvgLabel.precacheInFlight.size === 0) {
    // tslint:disable-next-line:no-console
    console.log("Deck Started, please press ctrl + c to stop operations !!!");
    clearInterval(logger);
  }
}
