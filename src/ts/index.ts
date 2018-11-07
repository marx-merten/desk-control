import { DeskStack } from "./streamdesk/deskstack";
import { SimpleDeskPage } from "./streamdesk/simpleDeskPage";

const deck = new DeskStack();

deck.addPage(new SimpleDeskPage("MAIN"));
deck.setMainPage("MAIN");

console.log("READY Press ctrl+c to stop operations !!!");
