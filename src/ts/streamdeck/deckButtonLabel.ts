import { DeckButton } from "./deckButton";
import { StreamKeyWrapper } from "./deckWrapper";

export abstract class DeckButtonLabel {
  public button?: DeckButton;
  public abstract draw(key: StreamKeyWrapper): void;
}
