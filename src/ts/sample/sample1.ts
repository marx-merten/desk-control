// tslint:disable:no-console
import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckStack, KEY_CLICK } from "../streamdeck/deckStack";
import { StreamKeyWrapper } from "../streamdeck/deckWrapper";
import { SimpleButton } from "../streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "../streamdeck/page/simpleDeckPage";
import { CharacterLabel, IconLabel } from "../streamdeck/page/svgLabel";

import { ICONS } from "../streamdeck/page/logos";
import { SubMenu } from "../streamdeck/page/submenueDeckPage";

export function main(deck: DeckStack) {
  deck.addPage(
    createSamplePage(
      "DEMO1",
      [
        { lbl: "ALARM", ico: ICONS.ALARM },
        { lbl: "ALARM_ON", ico: ICONS.ALARM_ON },
        { lbl: "ARCHIVE", ico: ICONS.ARCHIVE },
        { lbl: "BULB", ico: ICONS.BULB },
        { lbl: "CAL", ico: ICONS.CAL },
        { lbl: "CAM", ico: ICONS.CAM },
        { lbl: "CHECKED", ico: ICONS.CHECKED },
        { lbl: "CLOUD_INOUT", ico: ICONS.CLOUD_INOUT },
        { lbl: "CLOUD_OUT", ico: ICONS.CLOUD_OUT },
        { lbl: "CONFIG", ico: ICONS.CONFIG },
        { lbl: "DB", ico: ICONS.DB },
        { lbl: "EJECT", ico: ICONS.EJECT },
      ],
      "lightgrey",
      "DEMO2",
    ),
  );
  deck.addPage(
    createSamplePage(
      "DEMO2",
      [
        { lbl: "EXIT", ico: ICONS.EXIT },
        { lbl: "FF", ico: ICONS.FF },
        { lbl: "FOLDER", ico: ICONS.FOLDER },
        { lbl: "FOLDER_OPEN", ico: ICONS.FOLDER_OPEN },
        { lbl: "FREV", ico: ICONS.FREV },
        { lbl: "GLOBE", ico: ICONS.GLOBE },
        { lbl: "HOME", ico: ICONS.HOME },
        { lbl: "KVM", ico: ICONS.KVM },
        { lbl: "LOCKED", ico: ICONS.LOCKED },
        { lbl: "MENU", ico: ICONS.MENU },
        { lbl: "MIC", ico: ICONS.MIC },
        { lbl: "MIC_MUTE", ico: ICONS.MIC_MUTE },
        { lbl: "MUTE", ico: ICONS.MUTE },
      ],
      "lightgrey",
      "DEMO3",
    ),
  );
  deck.addPage(
    createSamplePage(
      "DEMO3",
      [
        { lbl: "NEXT", ico: ICONS.NEXT },
        { lbl: "PAUSE", ico: ICONS.PAUSE },
        { lbl: "PLAY", ico: ICONS.PLAY },
        { lbl: "PLUS", ico: ICONS.PLUS },
        { lbl: "POWER", ico: ICONS.POWER },
        { lbl: "PREVIOUS", ico: ICONS.PREVIOUS },
        { lbl: "PRINT", ico: ICONS.PRINT },
        { lbl: "RADAR", ico: ICONS.RADAR },
        { lbl: "SEARCH", ico: ICONS.SEARCH },
        { lbl: "SERVER", ico: ICONS.SERVER },
        { lbl: "STOP", ico: ICONS.STOP },
        { lbl: "SW_OFF", ico: ICONS.SW_OFF },
        { lbl: "SW_ON", ico: ICONS.SW_ON },
      ],
      "lightgrey",
      "DEMO4",
    ),
  );
  deck.addPage(
    createSamplePage(
      "DEMO4",
      [
        { lbl: "UNLOCKED", ico: ICONS.UNLOCKED },
        { lbl: "USER", ico: ICONS.USER },
        { lbl: "VOLUME", ico: ICONS.VOLUME },
        { lbl: "VOLUME_DOWN", ico: ICONS.VOLUME_DOWN },
        { lbl: "VOLUME_UP", ico: ICONS.VOLUME_UP },
        { lbl: "WAIT", ico: ICONS.WAIT },
        { lbl: "WIFI", ico: ICONS.WIFI },
        { lbl: "WINDOWS", ico: ICONS.WINDOWS },
        { lbl: "ZOOM_IN", ico: ICONS.ZOOM_IN },
        { lbl: "ZOOM_OUT", ico: ICONS.ZOOM_OUT },
      ],
      "lightgrey",
      "DEMO1",
    ),
  );

  function createSamplePage(
    name: string,
    ic: Array<{ lbl: string; ico: string }>,
    color = "lightsteelblue",
    nextPage = "MAIN",
  ) {
    const subPage = new SubMenu(name, deck, "MAIN");
    subPage.addButton(
      new SimpleButton("next", new CharacterLabel("N", "next")).on(
        KEY_CLICK,
        (key: any) => {
          deck.jumpPage(nextPage);
        },
      ),
    );
    ic.forEach((ico) => {
      const lbl = new IconLabel(ico.ico, ico.lbl);
      lbl.background = colorGet(color)!.value;
      subPage.addButton(new SimpleButton("MM", lbl));
    });
    return subPage;
  }
}
