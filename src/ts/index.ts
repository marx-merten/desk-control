import { DeskStack } from "./streamdesk/deskStack";
import { DeskButton, SimpleButton } from "./streamdesk/page/simpleDeskButton";
import { SimpleDeskPage } from "./streamdesk/page/simpleDeskPage";

const deck = new DeskStack();

const mainPage = new SimpleDeskPage("MAIN");
deck.addPage(mainPage);

mainPage.addButton(new SimpleButton("TL"), { x: 0, y: 0 });
mainPage.addButton(new SimpleButton("BR"), { x: 4, y: 2 });

deck.setMainPage("MAIN");

console.log("Desk Started, please press ctrl+c to stop operations !!!");
