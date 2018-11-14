import { DataUtil } from "../../utility";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

export class RandomColorLabel extends DeckButtonLabel {
  public draw(key: StreamKeyWrapper): void {
    key.fillColor(DataUtil.random(100, 200), DataUtil.random(20, 200), DataUtil.random(100, 200));
  }
}
