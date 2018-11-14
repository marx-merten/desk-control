import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { StreamKeyWrapper } from "./streamdeck/deckWrapper";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { RandomColorLabel } from "./streamdeck/page/simpleLabels";

const deck = new DeckStack();

const mainPage = new SimpleDeckPage("MAIN");
deck.addPage(mainPage);
const b = new SimpleButton("TL", new RandomColorLabel());

b.on(KEY_CLICK, (key: StreamKeyWrapper) => {
  // tslint:disable-next-line:no-console
  console.log("Pressed");
  b.markDirty();
});
mainPage.addButton(b, { x: 0, y: 0 });
mainPage.addButton(new SimpleButton("BR", new RandomColorLabel()), { x: 4, y: 2 });

deck.setMainPage("MAIN");

// tslint:disable-next-line:no-console
console.log("Deck Started, please press ctrl + c to stop operations !!!");
