import { DeckStack } from "../deckStack";
import { SimpleDeckPage } from "../page/simpleDeckPage";
import { SubMenu } from "../page/submenueDeckPage";
import { IDeckButton } from "./../deckButton";

export class KVMPage extends SubMenu {
  private btnOut: IDeckButton[] = [];
  private btnIn: IDeckButton[] = [];

  constructor(name: string, stack: DeckStack, returnTo?: string) {
    super(name, stack, returnTo);
  }
}
