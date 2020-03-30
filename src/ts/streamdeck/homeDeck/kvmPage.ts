import { Color, get as colorGet, to as colorTo } from "color-string";
import { DeckConfig } from "../../deckConfig";
import { KVM_RO_RESULT, KvmConnector } from "../connectors/kvmConnector";
import { DeckButton } from "../deckButton";
import { DeckStack, KEY_CLICK } from "../deckStack";
import { KVM } from "../page/logos";
import { SimpleButton } from "../page/simpleDeckButton";
import { SimpleDeckPage } from "../page/simpleDeckPage";
import { SubMenu } from "../page/submenueDeckPage";
import { CharacterLabel } from "../page/svgLabel";
import { IDeckButton } from "./../deckButton";

enum State {
  normal = 0,
  selected = 1,
  error = 99,
}

export class KVMPage extends SubMenu {
  private btnOut: Array<{ btn: DeckButton; lbl: CharacterLabel }> = [];
  private btnIn: Array<{ btn: DeckButton; lbl: CharacterLabel }> = [];

  private currentState = State.normal;
  private currentInputs = [0, 0, 0, 0, 0];
  private selectedOutputIndex = 0;
  private outputs = [1, 2, 3, 4, 8];
  private lastConnect = 0;

  constructor(name: string, stack: DeckStack, returnTo?: string) {
    super(name, stack, returnTo);

    this.hlpAddButton("OUT1", "X", this.btnOut, 0, 0, "left");
    this.hlpAddButton("OUT2", "X", this.btnOut, 1, 0, "center");
    this.hlpAddButton("OUT3", "X", this.btnOut, 2, 0, "right");
    this.hlpAddButton("OUT4", "X", this.btnOut, 3, 0, "CenterB");
    this.hlpAddButton("OUT5", "X", this.btnOut, 4, 0, "eltron");

    this.hlpAddButton("IN1", "1", this.btnIn, 0, 1).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN2", "2", this.btnIn, 1, 1).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN3", "3", this.btnIn, 2, 1).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN4", "4", this.btnIn, 0, 2).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN5", "5", this.btnIn, 1, 2).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN6", "6", this.btnIn, 2, 2).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN7", "7", this.btnIn, 3, 1).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.hlpAddButton("IN8", "8", this.btnIn, 3, 2).lbl.setBackground(
      DeckConfig.colDefaultInactive,
    );
    this.setupActionFunctions();
    this.switchToNormalState();
    this.updateCurrentState();

    this.on("ACTIVATED", () => {
      this.switchToNormalState();
    });
  }

  public createKvm(): KvmConnector {
    return new KvmConnector(
      DeckConfig.kvmHost,
      DeckConfig.kvmUser,
      DeckConfig.kvmPassword,
    );
  }

  private async updateCurrentState() {
    // Reset all input buttons, need a better aproach for this
    if (this.shouldConnect()) {
      const kvm = this.createKvm();
      kvm.clear();
      this.outputs.forEach((out, index) => {
        kvm.addCommand(
          "RO 0" + out,
          (res) => {
            try {
              const inNr = Number(res![1]);
              this.currentInputs[index] = inNr;
            } catch (e) {
              this.currentInputs[index] = -1;
            }
          },
          KVM_RO_RESULT,
        );
      });
      await kvm.execute((err: string) => {
        // tslint:disable-next-line:no-console
        console.log(err);
      });
    }
    this.updateButtonState();
  }

  private updateButtonState() {
    this.btnIn.forEach((b, i) => {
      this.updateBtInColor(i);
      b.btn.markDirty();
    });
    this.btnOut.forEach((b, i) => {
      this.updateBtnOut(i);
      b.btn.markDirty();
    });
  }

  private setupActionFunctions() {
    this.outputs.forEach((out, index) => {
      this.btnOut[index].btn.on(KEY_CLICK, () => {
        this.actOutputButton(index);
      });
    });
    this.btnIn.forEach((b, index) => {
      b.btn.on(KEY_CLICK, () => {
        this.actInputButton(index);
      });
    });
  }
  private updateBtnOut(index: number) {
    // need to be more precise on wether or not flag the button dirty
    const b = this.btnOut[index];
    const input = this.currentInputs[index];
    switch (this.currentState) {
      case State.normal:
        b.lbl.txt = input === -1 ? "X" : input.toString();
        b.lbl.background = DeckConfig.colDefault;
        break;
      case State.selected:
        b.lbl.txt = input === -1 ? "X" : input.toString();
        b.lbl.background =
          index === this.selectedOutputIndex
            ? DeckConfig.colDefaultActive
            : DeckConfig.colDefaultInactive;
        break;
    }
  }
  private updateBtInColor(index: number) {
    const b = this.btnIn[index];
    switch (this.currentState) {
      case State.normal:
        b.lbl.background =
          this.currentInputs.indexOf(index + 1) >= 0
            ? DeckConfig.colDefaultActive
            : DeckConfig.colDefaultInactive;
        break;
      case State.selected:
        const currentIn = this.currentInputs[this.selectedOutputIndex];

        b.lbl.background =
          index + 1 === currentIn
            ? DeckConfig.colDefaultActive
            : DeckConfig.colDefault;
        break;
    }
  }
  private actOutputButton(index: number) {
    if (this.currentState === State.selected) {
      if (index === this.selectedOutputIndex) {
        this.switchToNormalState();
      } else {
        this.selectedOutputIndex = index;
        this.updateButtonState();
      }
    } else {
      this.selectedOutputIndex = index;
      this.switchToSelectedState();
    }
  }
  private switchToSelectedState() {
    this.currentState = State.selected;
    this.outputs.forEach((out, index) => {
      this.btnOut[index].lbl.background =
        index === this.selectedOutputIndex
          ? DeckConfig.colDefaultHighlight
          : DeckConfig.colDefaultInactive;
      this.btnOut[index].btn.markDirty();
    });
    this.updateCurrentState();
  }

  private switchToNormalState() {
    this.currentState = State.normal;
    this.outputs.forEach((out, index) => {
      this.btnOut[index].lbl.background = DeckConfig.colDefault;
      this.btnOut[index].btn.markDirty();
    });

    this.btnIn.forEach((inp) => {
      inp.lbl.background = DeckConfig.colDefaultInactive;
      inp.btn.markDirty();
    });
    this.updateCurrentState();
  }

  private async actInputButton(index: number) {
    if (this.currentState === State.selected) {
      const kvm = this.createKvm();
      const cmd =
        "SS 0" + (index + 1) + ",0" + this.outputs[this.selectedOutputIndex];
      kvm.addCommand(cmd);
      await kvm.execute((error) => {
        //
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 120);
      });
      this.updateCurrentState();
    }
  }

  private shouldConnect(): boolean {
    const curTime = new Date().getTime();
    if (curTime - this.lastConnect > 100) {
      this.lastConnect = curTime;
      return true;
    } else {
      return false;
    }
  }
  private hlpAddButton(
    name: string,
    txt: string,
    store: Array<{ btn: DeckButton; lbl: CharacterLabel }>,
    xpos: number,
    ypos: number,
    label?: string,
  ): { btn: DeckButton; lbl: CharacterLabel } {
    const l = new CharacterLabel(txt, label);
    const p = new SimpleButton(name, l);
    const i = { btn: p, lbl: l };
    store.push(i);
    this.addButton(p, { x: xpos, y: ypos });
    return i;
  }
}
