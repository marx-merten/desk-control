// tslint:disable:max-classes-per-file

import { Color, get as colorGet, to as colorTo } from "color-string";
import { type } from "os";
import { DataUtil } from "../../utility";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

export class RandomColorLabel extends DeckButtonLabel {
  public draw(key: StreamKeyWrapper): void {
    key.fillColor(
      DataUtil.random(100, 200),
      DataUtil.random(20, 200),
      DataUtil.random(100, 200),
    );
  }
}

export class ColorLabel extends DeckButtonLabel {
  private background: Color = colorGet("lightgrey")!.value;
  public constructor(color: Color | string) {
    super();
    if (typeof color === "string") {
      const c1 = colorGet(color);
      if (c1 !== null) {
        this.background = c1.value;
      }
    } else {
      this.background = color;
    }
  }
  public draw(key: StreamKeyWrapper): void {
    const rgb = this.background;
    key.fillColor(rgb[0], rgb[1], rgb[2]);
  }
}

export class StateSwitchLabel extends DeckButtonLabel {
  public defaultLabel?: { state: string; label: DeckButtonLabel };
  public states: Map<string, DeckButtonLabel> = new Map();
  private currentState?: { state: string; label: DeckButtonLabel };

  get state(): string | undefined {
    if (this.currentState !== undefined) {
      return this.currentState.state;
    } else {
      return undefined;
    }
  }

  set state(s: string | undefined) {
    if (s !== undefined && this.states.has(s)) {
      this.currentState = { state: s, label: this.states.get(s)! };
    } else {
      this.currentState = this.defaultLabel;
    }
    if (this.button !== undefined) {
      this.button.markDirty();
    }
  }
  set default(lbl: DeckButtonLabel) {
    this.defaultLabel = { state: "___UNDEFINED___", label: lbl };
    if (this.button !== undefined) {
      this.button.markDirty();
    }
    this.currentState = this.defaultLabel;
  }

  public addState(state: string, lbl: DeckButtonLabel): this {
    if (state === "___UNDEFINED___") {
      this.default = lbl;
    } else {
      this.states.set(state, lbl);
    }
    return this;
  }

  public draw(key: StreamKeyWrapper): void {
    if (this.currentState !== undefined) {
      this.currentState.label.draw(key);
    }
  }
}
