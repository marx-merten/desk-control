import * as Color from "color";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { ColorLabel, RandomColorLabel, StateSwitchLabel } from "./streamdeck/page/simpleLabels";
import { SvgLabel } from "./streamdeck/page/svgLabel";

const deck = new DeckStack();

const mainPage = new SimpleDeckPage("MAIN");
deck.addPage(mainPage);
const sl = new StateSwitchLabel();
sl.addState("ON", new ColorLabel(Color.rgb([0, 200, 0])));
sl.addState("OFF", new ColorLabel(Color.rgb([200, 0, 0])));
sl.state = "ON";

const b = new SimpleButton("TL", sl);

b.on(KEY_CLICK, (key: StreamKeyWrapper) => {
  // tslint:disable-next-line:no-console
  console.log("Pressed");
  const s = sl.state;
  if (s === "ON") {
    sl.state = "OFF";
  } else {
    sl.state = "ON";
  }
  b.markDirty();
});
mainPage.addButton(b, { x: 0, y: 0 });

mainPage.addButton(new SimpleButton("BR", new SvgLabel()), { x: 4, y: 2 });

deck.setMainPage("MAIN");

// tslint:disable-next-line:no-console
console.log("Deck Started, please press ctrl + c to stop operations !!!");
