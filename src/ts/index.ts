import { DeskStack } from "./streamdesk/deskstack";
import { SimpleDeskPage } from "./streamdesk/page/simpleDeskPage";

const deck = new DeskStack();

const mainPage = new SimpleDeskPage("MAIN");
deck.addPage(mainPage);
deck.setMainPage("MAIN");

console.log("READY Press ctrl+c to stop operations !!!");
