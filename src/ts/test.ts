import { ElgatoConnector } from "./streamdeck/connectors/elgatoConnector";
import { KeyLight } from "./util/elgato-api";


const c = new ElgatoConnector();
setTimeout(() => {
  console.log(c.lights.map((kl) => kl.name))
}, 1000);

c.on('updatedLight', (kl: KeyLight) => {
  console.log("Light Updated.")
  console.log(kl.name)
})
c.on('newLight', (kl: KeyLight) => {
  console.log("Light New.")
  console.log(kl.name)

})
c.startUpdate(1000);
