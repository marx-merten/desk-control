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
import { MqttLabel, MqttCallbackLabel } from "./streamdeck/page/mqttLabel";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";


import { createMqttIconStateButton, createMqttPowerStateButton } from "./streamdeck/homeDeck/buttonTemplates";
import { CharacterLabel, IconLabel, SvgLabel } from "./streamdeck/page/svgLabel";
import { exec } from "child_process";

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
  .addButton(new SimpleButton("kvm", new IconLabel(ICONS.KVM).setBackground(DeckConfig.colDefault)), {
    x: 1,
    y: 0,
  })
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
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "work")), {
    x: 1,
    y: 0,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 03");
    kvmApi.execute(() => {
      //
    });
  });

favs
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "game")), {
    x: 1,
    y: 1,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 04");
    kvmApi.execute(() => {
      //
    });
  });

favs
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "game only")), {
    x: 1,
    y: 2,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 05");
    kvmApi.execute(() => {
      //
    });
  });

favs
  .addButton(new SimpleButton("profile1", new IconLabel(ICONS.POWER, "STBY")), {
    x: 4,
    y: 0,
  })
  .on(KEY_CLICK, () => {
    const kvmApi = kvm.createKvm();
    kvmApi.addCommand("LO 06");
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
page.addButton(new SimpleButton("kvm", new IconLabel(ICONS.FOLDER, "kvm")), { x: 0, y: 0 }).jumpOnClick("FAVS");

// ---------------------------
// Sonos and Audio
// ---------------------------

const audio = new SubMenu("AUDIO", deck);

deck.addPage(audio);
page.addButton(new SimpleButton("audio", new IconLabel(ICONS.FOLDER, "audio")), { x: 4, y: 1 }).jumpOnClick("AUDIO");

// ---------------------------
//    MainButtons
// ---------------------------
// ------------------------------
//  Setup mqtt relevant elements
// ------------------------------
const m1 = mqttConnect("mqtt://nas:9883");
m1.setMaxListeners(200);

const m2 = mqttConnect("mqtt://nas:1883");
m2.setMaxListeners(200);


let connectOnce = false;

let connectOnce2 = false;

// Add plain mqqt channel for synergy status
m2.on("connect", () => {
  console.log("Connected MQTT-plain");

  // page.addButton(
  //   new SimpleButton("activeConsole", new CharacterLabel("test", "lab", true));
  // );

  let lblKvm = new CharacterLabel("test", "lab", true)
  lblKvm.enableCache = false;
  lblKvm.setBackground(colorGet("lavender")!.value);
  let mqttKvm = new MqttCallbackLabel(m2, "/homeoffice/desk/kvm/target", lblKvm, (topic, content) => {
    let cstr: string = content.toString();
    lblKvm.txt = cstr.substring(0, 1).toUpperCase();
    lblKvm.label = cstr.substring(0, 7);

    return true;
  })
  page.addButton(new SimpleButton("activeConsole", mqttKvm), { x: 4, y: 0 })
    .on(KEY_CLICK, () => {
      lblKvm.txt = "-";
      mqttKvm.markDirty();
      exec('sudo systemctl restart kvm.service', (err, stdout, stderr) => {
        // your callback
      });
    });

  // finally
  connectOnce2 = true;
});

m1.on("connect", () => {
  // tslint:disable-next-line:no-console
  console.log("Connected MQTT");
  if (connectOnce) {
    console.log("Reconnect requested, ignore adding buttons");
    return;
  }
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
  audio.addButton(
    createMqttIconStateButton(
      m1,
      "sonos",
      "sonos",
      "sonos/0/root/172_17_0_85/state",
      [{ icon: ICONS.PAUSE, state: "play" }, { icon: ICONS.PLAY, state: "pause" }, { icon: ICONS.PLAY, state: "stop" }],
      "sonos/0/root/172_17_0_85/state/set",
    ),
    { x: 0, y: 1 },
  );

  // Add Additional Button on main Screen to pause main audio
  page.addButton(
    createMqttIconStateButton(
      m1,
      "sonos",
      "sonos",
      "sonos/0/root/172_17_0_85/state",
      [{ icon: ICONS.PAUSE, state: "play" }, { icon: ICONS.PLAY, state: "pause" }, { icon: ICONS.PLAY, state: "stop" }],
      "sonos/0/root/172_17_0_85/state/set",
    ),
    { x: 3, y: 2 },
  );
  audio.addButton(
    createMqttDimStateButton(
      m1,
      "VolUp",
      "sonos/0/root/172_17_0_85/volume",
      5,
      undefined,
      "sonos/0/root/172_17_0_85/volume/set",
      ICONS.VOLUME_UP,
    ),
    { x: 1, y: 0 },
  );
  audio.addButton(
    createMqttDimStateButton(
      m1,
      "VolDown",
      "sonos/0/root/172_17_0_85/volume",
      -5,
      undefined,
      "sonos/0/root/172_17_0_85/volume/set",
      ICONS.VOLUME_DOWN,
    ),
    { x: 0, y: 0 },
  );
  audio
    .addButton(new SimpleButton("Skip", new IconLabel(ICONS.NEXT)), {
      x: 1,
      y: 1,
    })
    .on("keyClick", () => {
      m1.publish("sonos/0/root/172_17_0_85/next/set", "true");
    });

  connectOnce = true;
});

// ----------------------
//    Timing and Clock
// ----------------------
// const clock = new IconLabel(ICONS.CAL, moment().format("HH:mm"));
// clock.enableCache = false;
// const clockBtn = new SimpleButton("clock", clock);
// page.addButton(clockBtn, {
//   x: 3,
//   y: 0,
// });

// let timerI = setInterval(() => {
//   clock.label = moment().format("HH:mm");
//   clockBtn.markDirty();
// }, 10000);

// clockBtn.on("keyClick", () => {
//   clearInterval(timerI);
//   timerI = setInterval(() => {
//     clock.label = moment().format("HH:mm");
//     clockBtn.markDirty();
//   }, 10000);

//   clock.label = moment().format("HH:mm");
//   clockBtn.markDirty();
// });


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
