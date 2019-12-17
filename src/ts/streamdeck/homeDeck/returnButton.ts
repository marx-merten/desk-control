import { SimpleButton } from "../page/simpleDeckButton";
import { IconLabel } from "../page/svgLabel";
import { ICONS } from "../page/logos";
import { KvmConnector } from "../connectors/kvmConnector";
import { DeckConfig } from "../../deckConfig";
import { Color, get as colorGet, to as colorTo } from "color-string";


export class ReturnButtonState {
    public lbl: string;
    public mode: string;
    constructor(lbl: string, mode: string) {
        this.lbl = lbl;
        this.mode = mode;
    }
}

export class ReturnLastKvmStateButton extends SimpleButton {


    last: ReturnButtonState;
    current: ReturnButtonState;
    constructor(name: string, last: ReturnButtonState, current: ReturnButtonState) {
        super(name)
        this.last = last;
        this.current = current;
        this.label = new IconLabel(ICONS.RADAR, this.last.lbl).setBackground(colorGet("lavender")!.value);
        this.markDirty();
    }

    createKvm(): KvmConnector {
        return new KvmConnector(
            DeckConfig.kvmHost,
            DeckConfig.kvmUser,
            DeckConfig.kvmPassword,
        );
    }
    switchToLastMode() {
        const kvmApi = this.createKvm();
        kvmApi.addCommand("LO " + this.last.mode);
        kvmApi.execute(() => {

        });
        this.modeSwitched(this.last);
    }
    modeSwitched(newState: ReturnButtonState) {
        if (newState.mode !== this.current.mode) {
            [this.last, this.current] = [this.current, newState];
            console.log("Switched :: ", this.last)
            this.label = new IconLabel(ICONS.RADAR, this.last.lbl).setBackground(colorGet("lavender")!.value);
            this.markDirty();
        }
    }

    swapStates() {
        [this.last, this.current] = [this.current, this.last];
        this.label = new IconLabel(ICONS.RADAR, this.last.lbl).setBackground(colorGet("lavender")!.value);
        this.markDirty()
    }
}