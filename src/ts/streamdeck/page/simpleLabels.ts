// tslint:disable:max-classes-per-file

import * as Color from "color";
import { type } from "os";
import { DataUtil } from "../../utility";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

export class RandomColorLabel extends DeckButtonLabel {
  public draw(key: StreamKeyWrapper): void {
    key.fillColor(DataUtil.random(100, 200), DataUtil.random(20, 200), DataUtil.random(100, 200));
  }
}

export class ColorLabel extends DeckButtonLabel {
  private background: Color;
  public constructor(color: Color) {
    super();
    this.background = color;
  }
  public draw(key: StreamKeyWrapper): void {
    const rgb = this.background.rgb().array();
    key.fillColor(rgb[0], rgb[1], rgb[2]);
  }
}

export class StateSwitchLabel extends DeckButtonLabel {
  public defaultLabel?: { state: string; label: DeckButtonLabel };
  private states: Map<string, DeckButtonLabel> = new Map();
  private currentState?: { state: string; label: DeckButtonLabel };

  get state(): string | undefined {
    if (this.currentState !== undefined) {
      return this.currentState.state;
    } else {
      return undefined;
    }
  }

  set state(s: string | undefined) {
    if (this.states.has(s!)) {
      this.currentState = { state: s!, label: this.states.get(s!)! };
    } else {
      this.currentState = this.defaultLabel;
    }
  }
  set default(lbl: DeckButtonLabel) {
    this.defaultLabel = { state: "___UNDEFINED___", label: lbl };
  }

  public addState(state: string, lbl: DeckButtonLabel): this {
    this.states.set(state, lbl);
    return this;
  }

  public draw(key: StreamKeyWrapper): void {
    if (this.currentState !== undefined) {
      this.currentState.label.draw(key);
    }
  }
}
