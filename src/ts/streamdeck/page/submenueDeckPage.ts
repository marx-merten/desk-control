import { DeckStack, KEY_CLICK } from "../deckStack";
import { StreamKeyWrapper } from "../deckWrapper";
import { ICONS } from "./logos";
import { SimpleButton } from "./simpleDeckButton";
import { SimpleDeckPage } from "./simpleDeckPage";
import { IconLabel } from "./svgLabel";

export class SubMenu extends SimpleDeckPage {
  public stack: DeckStack;
  private exitButton: SimpleButton;
  returnTo: string | undefined;
  constructor(name: string, stack: DeckStack, returnTo?: string) {
    super(name);
    this.stack = stack;
    this.returnTo = returnTo;
    this.exitButton = new SimpleButton("exit", new IconLabel(ICONS.EXIT));
    this.exitButton.on(KEY_CLICK, (key: StreamKeyWrapper) => {
      this.returnFromFolder();
    });
    this.addButton(this.exitButton, { x: 4, y: 2 });
  }
  public returnFromFolder() {
    if (this.returnTo === undefined) {
      this.stack.returnToPrevious();
    } else {
      this.stack.returnTo(this.returnTo);
    }
  }
}
