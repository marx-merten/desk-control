// tslint:disable:no-console

import { Color, get as colorGet, to as colorTo } from "color-string";
import moment from "moment";
import { connect as mqttConnect } from "mqtt";
import { DeckConfig } from "./deckConfig";
import { main as demoMain } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { createMqttDimStateButton } from "./streamdeck/homeDeck/buttonTemplates";
import { KVMPage } from "./streamdeck/homeDeck/kvmPage";
import { ICONS } from "./streamdeck/page/logos";
import { MqttLabel } from "./streamdeck/page/mqttLabel";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";

import {
  createMqttIconStateButton,
  createMqttPowerStateButton,
} from "./streamdeck/homeDeck/buttonTemplates";
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
      x: 1,
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
    { x: 0, y: 0 },
  )
  .jumpOnClick("FAVS");

// ---------------------------
//    MainButtons
// ---------------------------
// ------------------------------
//  Setup mqtt relevant elements
// ------------------------------
const m1 = mqttConnect("mqtt://nas:9883");
m1.setMaxListeners(200);

m1.on("connect", () => {
  // tslint:disable-next-line:no-console
  console.log("Connected MQTT");

  page.addButton(
    createMqttPowerStateButton(
      m1,
      "Light",
      "HO",
      "hm-rpc/1/000858A994DA3B/4/STATE",
      "hm-rpc/1/000858A994DA3B/4/STATE/set",
    ),
    {
      x: 0,
      y: 2,
    },
  );
  page.addButton(
    createMqttPowerStateButton(
      m1,
      "DeskLight",
      "Desk",
      "hm-rpc/1/0001D8A9933FDD/3/STATE",
      "hm-rpc/1/0001D8A9933FDD/3/STATE/set",
    ),
    {
      x: 1,
      y: 2,
    },
  );
  page.addButton(
    createMqttPowerStateButton(
      m1,
      "MMini",
      "Mac",
      "hm-rpc/1/0001D8A9933E33/3/STATE",
      "hm-rpc/1/0001D8A9933E33/3/STATE/set",
      ICONS.DB,
    ),
    {
      x: 2,
      y: 2,
    },
  );
  page.addButton(
    createMqttPowerStateButton(
      m1,
      "EDesk",
      "Elektro",
      "hm-rpc/1/0001D8A9933F8D/3/STATE",
      "hm-rpc/1/0001D8A9933F8D/3/STATE/set",
      ICONS.SW_ON,
      ICONS.SW_OFF,
    ),
    {
      x: 1,
      y: 1,
    },
  );
  page.addButton(
    createMqttPowerStateButton(
      m1,
      "EDesk",
      "Desk",
      "hm-rpc/1/0001D8A9933F93/3/STATE",
      "hm-rpc/1/0001D8A9933F93/3/STATE/set",
      ICONS.SW_ON,
      ICONS.SW_OFF,
    ),
    {
      x: 2,
      y: 1,
    },
  );

  page.addButton(
    createMqttIconStateButton(
      m1,
      "rollade",
      "rollo",
      "hm-rpc/0/OEQ1850720/1/LEVEL",
      [
        {
          icon: "./src/res/homeAutomation/blindClose.png",
          lbl: "Fenster",
          state: "0",
        },
        {
          icon: "./src/res/homeAutomation/blindOpen.png",
          lbl: "Fenster",
          state: "100",
        },
      ],
      "hm-rpc/0/OEQ1850720/1/LEVEL/set",
      "hm-rpc/0/OEQ1850720/1/WORKING",
    ),
    { x: 0, y: 1 },
  );
  page.addButton(
    createMqttIconStateButton(
      m1,
      "sonos",
      "sonos",
      "sonos/0/root/172_17_0_85/state",
      [
        { icon: ICONS.PAUSE, state: "play" },
        { icon: ICONS.PLAY, state: "pause" },
        { icon: ICONS.PLAY, state: "stop" },
      ],
      "sonos/0/root/172_17_0_85/state/set",
    ),
    { x: 3, y: 2 },
  );
  page.addButton(
    createMqttDimStateButton(
      m1,
      "VolUp",
      "sonos/0/root/172_17_0_85/volume",
      5,
      undefined,
      "sonos/0/root/172_17_0_85/volume/set",
      ICONS.VOLUME_UP,
    ),
    { x: 4, y: 1 },
  );
  page.addButton(
    createMqttDimStateButton(
      m1,
      "VolDown",
      "sonos/0/root/172_17_0_85/volume",
      -5,
      undefined,
      "sonos/0/root/172_17_0_85/volume/set",
      ICONS.VOLUME_DOWN,
    ),
    { x: 3, y: 1 },
  );
  page
    .addButton(new SimpleButton("Skip", new IconLabel(ICONS.NEXT)), {
      x: 4,
      y: 2,
    })
    .on("keyClick", () => {
      m1.publish("sonos/0/root/172_17_0_85/next/set", "true");
    });
});

// ----------------------
//    Timing and Clock
// ----------------------
const clock = new IconLabel(ICONS.CAL, moment().format("HH:mm"));
const clockBtn = new SimpleButton("clock", clock);
page.addButton(clockBtn, {
  x: 2,
  y: 0,
});

let timerI = setInterval(() => {
  clock.label = moment().format("HH:mm");
  clockBtn.markDirty();
}, 20000);

clockBtn.on("keyClick", () => {
  clearInterval(timerI);
  timerI = setInterval(() => {
    clock.label = moment().format("HH:mm");
    clockBtn.markDirty();
  }, 20000);

  clock.label = moment().format("HH:mm");
  clockBtn.markDirty();
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

// ---------------------------------------
//   Try Global Catch --- may fix crashes
// ---------------------------------------
process.on("uncaughtException", (err) => {
  console.error("-------- Node NOT Exiting...");
  console.error(err.stack);
  console.log("-------- Node NOT Exiting...");
});
