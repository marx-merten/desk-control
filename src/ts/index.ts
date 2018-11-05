import { DeskStack, SimpleDeskPage } from "./streamdesk/deskstack";

const deck = new DeskStack();

deck.addPage(new SimpleDeskPage("MAIN"));
deck.setMainPage("MAIN");
