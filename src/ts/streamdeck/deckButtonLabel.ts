import { StreamKeyWrapper } from "./deckWrapper";

export abstract class DeckButtonLabel {
  public abstract draw(key: StreamKeyWrapper): void;
}
