import { Color, get as colorGet, to as colorTo } from "color-string";
import { connect as mqttConnect } from "mqtt";
import { DeckConfig } from "./deckConfig";
import { main as demoMain } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { KVMPage } from "./streamdeck/homeDeck/kvmPage";
import { ICONS } from "./streamdeck/page/logos";
import { MqttLabel } from "./streamdeck/page/mqttLabel";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";

import { createMqttStateButton } from "./streamdeck/homeDeck/buttonTemplates";
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

// ------------------------------
//  Setup mqtt relevant elements
// ------------------------------
const m1 = mqttConnect("mqtt://nas:9883");
m1.on("connect", () => {
  // tslint:disable-next-line:no-console
  console.log("Connected MQTT");
  page.addButton(
    createMqttStateButton(
      m1,
      "DeskLight",
      "Desk",
      "hm-rpc/1/0001D8A9933FDD/3/STATE",
    ),
    {
      x: 1,
      y: 2,
    },
  );
  page.addButton(
    createMqttStateButton(m1, "Light", "HO", "hm-rpc/1/000858A994DA3B/4/STATE"),
    {
      x: 0,
      y: 2,
    },
  );
  page.addButton(
    createMqttStateButton(
      m1,
      "EDesk",
      "Elektro",
      "hm-rpc/1/0001D8A9933F8D/3/STATE",
      "hm-rpc/1/0001D8A9933F8D/3/STATE",
      ICONS.SW_ON,
      ICONS.SW_OFF,
    ),
    {
      x: 3,
      y: 2,
    },
  );
  page.addButton(
    createMqttStateButton(
      m1,
      "EDesk",
      "Desk",
      "hm-rpc/1/0001D8A9933F93/3/STATE",
      "hm-rpc/1/0001D8A9933F93/3/STATE",
      ICONS.SW_ON,
      ICONS.SW_OFF,
    ),
    {
      x: 4,
      y: 2,
    },
  );
});

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
