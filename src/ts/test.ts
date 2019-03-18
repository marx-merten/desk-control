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

import { createMqttIconStateButton, createMqttPowerStateButton } from "./streamdeck/homeDeck/buttonTemplates";
import { CharacterLabel, IconLabel, SvgLabel } from "./streamdeck/page/svgLabel";

const deck = new DeckStack();
const page = new SimpleDeckPage("MAIN");

deck.setMainPage(page);

// Favs Folder
// ---------------
const favs = new SubMenu("FAVS", deck);
deck.addPage(favs);
page.addButton(new SimpleButton("fav", new IconLabel(ICONS.FOLDER, "kvm")), { x: 0, y: 0 }).jumpOnClick("FAVS");
favs.addButton(new SimpleButton("kvm", new IconLabel(ICONS.KVM).setBackground(DeckConfig.colDefault)), {
  x: 1,
  y: 0,
});

const m1 = mqttConnect("mqtt://localhost:1883");
m1.setMaxListeners(200);

m1.on("connect", () => {
  page.addButton(createMqttPowerStateButton(m1, "Light", "HO", "test/1", "test/1/set"), {
    x: 0,
    y: 2,
  });
});
