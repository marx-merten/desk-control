// tslint:disable:no-console
import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { ColorLabel, RandomColorLabel, StateSwitchLabel } from "./streamdeck/page/simpleLabels";
import { CharacterLabel, IconLabel, SvgLabel } from "./streamdeck/page/svgLabel";
import { DataUtil } from "./utility";

import * as fs from "fs";
import * as path from "path";
import { ICONS } from "./streamdeck/page/logos";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";
const deck = new DeckStack();

const subPage = new SubMenu("SUB", deck);
for (let i = 0; i < 12; i++) {
  subPage.addButton(new SimpleButton("nope", new IconLabel(ICONS.ALARM, "ICON:" + i)));
}

deck.addPage(subPage);

const mainPage = new SimpleDeckPage("MAIN");
mainPage
  .addButton(new SimpleButton("open", new IconLabel(ICONS.FF, "config")))
  .on(KEY_CLICK, (key: StreamKeyWrapper) => {
    deck.jumpPage("SUB");
  });

deck.addPage(mainPage);
deck.setMainPage("MAIN");

console.log("Deck Started, please press ctrl + c to stop operations !!!");
