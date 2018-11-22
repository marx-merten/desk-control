import { main } from "./sample/sample1";
import { DeckStack, KEY_CLICK } from "./streamdeck/deckStack";
import { SimpleButton } from "./streamdeck/page/simpleDeckButton";
import { SimpleDeckPage } from "./streamdeck/page/simpleDeckPage";
import { CharacterLabel } from "./streamdeck/page/svgLabel";

const deck = new DeckStack();
const page = new SimpleDeckPage("MAIN");
page.addButton(
  new SimpleButton("next", new CharacterLabel("D", undefined, true)).on(
    KEY_CLICK,
    (key: any) => {
      deck.jumpPage("DEMO1");
    },
  ),
);
main(deck);
deck.addPage(page);
deck.setMainPage("MAIN");

// tslint:disable-next-line:no-console
console.log("Deck Started, please press ctrl + c to stop operations !!!");
