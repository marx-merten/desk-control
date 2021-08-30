import { SubMenu } from "../page/submenueDeckPage";
import { SimpleButton } from "../page/simpleDeckButton";
import { IconLabel } from "../page/svgLabel";
import { ICONS } from "../page/logos";
import { KEY_CLICK, DeckStack } from "../deckStack";
import { DeckConfig } from "../../deckConfig";
import { KVMPage } from "../homeDeck/kvmPage";
import { ReturnLastKvmStateButton } from "../homeDeck/returnButton";

export function createKvmFavs(kvm: KVMPage, rtLastKVM: ReturnLastKvmStateButton, deck: DeckStack): SubMenu {
    const favs = new SubMenu("FAVS", deck);
    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "main")), {
            x: 0,
            y: 0,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 01");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "main", mode: "01" });
        });

    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "work")), {
            x: 1,
            y: 0,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 03");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "work", mode: "03" })
        });
    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "EDesk")), {
            x: 2,
            y: 0,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 07");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "EDesk", mode: "07" })
        });
    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "SDesk")), {
            x: 2,
            y: 1,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 08");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "SDesk", mode: "08" })
        });

    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "game")), {
            x: 1,
            y: 1,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 04");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "game", mode: "04" })
        });

    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "game only")), {
            x: 1,
            y: 2,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 05");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "game Only", mode: "05" });
        });




    favs
        .addButton(new SimpleButton("profile1", new IconLabel(ICONS.KVM, "laptop")), {
            x: 0,
            y: 1,
        })
        .on(KEY_CLICK, () => {
            const kvmApi = kvm.createKvm();
            kvmApi.addCommand("LO 02");
            kvmApi.execute(() => { });
            rtLastKVM.modeSwitched({ lbl: "laptop", mode: "02" });
        });

    favs
        .addButton(new SimpleButton("kvm", new IconLabel(ICONS.KVM).setBackground(DeckConfig.colDefault)), {
            x: 4,
            y: 0,
        })
        .jumpOnClick("kvm");

    return favs;
}