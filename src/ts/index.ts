// tslint:disable:no-console
import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { ICON_CONFIG } from "./streamdeck/page/logos";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { ColorLabel, RandomColorLabel, StateSwitchLabel } from "./streamdeck/page/simpleLabels";
import { CharacterLabel, IconLabel, SvgLabel } from "./streamdeck/page/svgLabel";
import { DataUtil } from "./utility";

import * as fs from "fs";
import * as path from "path";
import { SubMenu } from "./streamdeck/page/submenueDeckPage";
const deck = new DeckStack();

const subPage = new SubMenu("SUB", deck);
for (let i = 0; i < 12; i++) {
  subPage.addButton(new SimpleButton("nope", new IconLabel(ICON_CONFIG, "ICON:" + i)));
}

deck.addPage(subPage);

const mainPage = new SimpleDeckPage("MAIN");
mainPage
  .addButton(new SimpleButton("open", new IconLabel(ICON_CONFIG, "config")))
  .on(KEY_CLICK, (key: StreamKeyWrapper) => {
    deck.jumpPage("SUB");
  });

deck.addPage(mainPage);
deck.setMainPage("MAIN");

console.log("Deck Started, please press ctrl + c to stop operations !!!");
