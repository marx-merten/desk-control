import { ElgatoLightAPI, KeyLight } from "../../util/elgato-api";
import { kernel } from "sharp";
import { EventEmitter } from "events";

export class ElgatoConnector extends EventEmitter {
    private lightAPI = new ElgatoLightAPI();

    get lights(): Array<KeyLight> {
        return this.lightAPI.keyLights
    }

    constructor() {
        super()
        this.lightAPI.on('updatedLight', (kl) => this.emit('updatedLight', kl))
        this.lightAPI.on('newLight', (kl) => this.emit('newLight', kl))
    }

    public startUpdate(interval = 500) {
        setInterval(() => { this.lightAPI.updateAllStatus() }, interval)
    }

    public switch(value: number, filter: string = ".*") {
        this.lightAPI.keyLights.forEach((light, index) => {
            if (light.name.match(filter)) {
                let o = light.options;
                if (o) {
                    o.lights[0].on = value;
                    this.lightAPI.updateLightOptions(light, o);
                }
            }
        })
    }


}

//let lights: Array<KeyLight> = []
// lightAPI.on('newLight', (newLight: KeyLight) => {
//     console.log(newLight.name);
//     lights.push(newLight);
// });