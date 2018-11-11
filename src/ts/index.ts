import { DeskStack, KEY_CLICK } from "./streamdesk/deskStack";
import { StreamKeyWrapper } from "./streamdesk/deskWrapper";
import { DeskButton, SimpleButton } from "./streamdesk/page/simpleDeskButton";
import { SimpleDeskPage } from "./streamdesk/page/simpleDeskPage";

const deck = new DeskStack();

const mainPage = new SimpleDeskPage("MAIN");
deck.addPage(mainPage);
const b = new SimpleButton("TL");

b.on(KEY_CLICK, (key: StreamKeyWrapper) => {
  // tslint:disable-next-line:no-console
  console.log("Pressed");
});
mainPage.addButton(b, { x: 0, y: 0 });
mainPage.addButton(new SimpleButton("BR"), { x: 4, y: 2 });

deck.setMainPage("MAIN");

console.log("Desk Started, please press ctrl+c to stop operations !!!");
