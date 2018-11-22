// tslint:disable:no-console
import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckStack, KEY_CLICK } from "../streamdeck/deckStack";
import { StreamKeyWrapper } from "../streamdeck/deckWrapper";
import { SimpleButton } from "../streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "../streamdeck/page/simpleDeckPage";
import { IconLabel } from "../streamdeck/page/svgLabel";

import { ICONS } from "../streamdeck/page/logos";
import { SubMenu } from "../streamdeck/page/submenueDeckPage";

export function main() {
  const deck = new DeckStack();

  const mainPage = new SimpleDeckPage("MAIN");
  mainPage.addButton(new SimpleButton("sub1", new IconLabel(ICONS.FOLDER, "sub1"))).on(KEY_CLICK, () => {
    deck.jumpPage("SUB1");
  });
  mainPage.addButton(new SimpleButton("sub2", new IconLabel(ICONS.FOLDER, "sub2"))).on(KEY_CLICK, () => {
    deck.jumpPage("SUB2");
  });
  mainPage.addButton(new SimpleButton("sub3", new IconLabel(ICONS.FOLDER, "sub3"))).on(KEY_CLICK, () => {
    deck.jumpPage("SUB3");
  });
  mainPage.addButton(new SimpleButton("sub4", new IconLabel(ICONS.FOLDER, "sub4"))).on(KEY_CLICK, () => {
    deck.jumpPage("SUB4");
  });

  deck.addPage(mainPage);
  deck.addPage(
    createSamplePage(
      "SUB1",
      [
        ICONS.ALARM,
        ICONS.ALARM_ON,
        ICONS.ARCHIVE,
        ICONS.BULB,
        ICONS.CAL,
        ICONS.CAM,
        ICONS.CHECKED,
        ICONS.CLOUD_INOUT,
        ICONS.CLOUD_OUT,
        ICONS.CONFIG,
        ICONS.DB,
        ICONS.EJECT,
      ],
      "lightcoral",
    ),
  );
  deck.addPage(
    createSamplePage(
      "SUB2",
      [
        ICONS.EXIT,
        ICONS.FF,
        ICONS.FOLDER,
        ICONS.FOLDER_OPEN,
        ICONS.FREV,
        ICONS.GLOBE,
        ICONS.HOME,
        ICONS.KVM,
        ICONS.LOCKED,
        ICONS.MENU,
        ICONS.MIC,
        ICONS.MIC_MUTE,
        ICONS.MUTE,
      ],
      "lightgreen",
    ),
  );
  deck.addPage(
    createSamplePage(
      "SUB3",
      [
        ICONS.NEXT,
        ICONS.PAUSE,
        ICONS.PLAY,
        ICONS.PLUS,
        ICONS.POWER,
        ICONS.PREVIOUS,
        ICONS.PRINT,
        ICONS.RADAR,
        ICONS.SEARCH,
        ICONS.SERVER,
        ICONS.STOP,
        ICONS.SW_OFF,
        ICONS.SW_ON,
      ],
      "lightseagreen",
    ),
  );
  deck.addPage(
    createSamplePage(
      "SUB4",
      [
        ICONS.UNLOCKED,
        ICONS.USER,
        ICONS.VOLUME,
        ICONS.VOLUME_DOWN,
        ICONS.VOLUME_UP,
        ICONS.WAIT,
        ICONS.WIFI,
        ICONS.WINDOWS,
        ICONS.ZOOM_IN,
        ICONS.ZOOM_OUT,
      ],
      "deepskyblue",
    ),
  );

  deck.setMainPage("MAIN");

  console.log("Deck Started, please press ctrl + c to stop operations !!!");
  function createSamplePage(name: string, ICONS: string[], color = "lightsteelblue") {
    const subPage = new SubMenu(name, deck);
    ICONS.forEach((ico) => {
      const lbl = new IconLabel(ico);
      lbl.background = colorGet(color)!.value;
      subPage.addButton(new SimpleButton("MM", lbl));
    });
    return subPage;
  }
}
