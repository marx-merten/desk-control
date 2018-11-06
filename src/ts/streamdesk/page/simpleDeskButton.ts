import { EventEmitter } from "events";
import { DataUtil } from "../../utility";
import { IDeskButton } from "../deskButton";
import { IDeskPage } from "../deskstack";
import { StreamKeyWrapper } from "../deskWrapper";
// tslint:disable-next-line:max-classes-per-file
export class DeskButton extends EventEmitter implements IDeskButton {
  public get state(): string {
    return "HH";
  }
  public page?: IDeskPage;
  public show(deck: StreamKeyWrapper): void {
    deck.fillColor(
      DataUtil.random(0, 255),
      DataUtil.random(0, 255),
      DataUtil.random(0, 255),
    );
  }
}
