import bonjour, { Bonjour, Service } from "bonjour";
import { put, get } from "request-promise";
import { EventEmitter } from "events";
import { KeyLight, KeyLightOptions } from "./types/KeyLight";

export class ElgatoLightAPI extends EventEmitter {
    private bonjour: Bonjour;
    public keyLights: Array<KeyLight>;

    /**
     * Creates an instance of ElgatoLightAPI.
     *
     * @memberof ElgatoLightAPI
     */
    constructor() {
        super();

        this.bonjour = bonjour();

        this.keyLights = new Array();

        // Continually monitors for a new keylight to be added
        const browser = this.bonjour.find({ type: 'elg' });
        browser.on('up', (service: Service) => {
            this.addKeylight(service);
        });
    }


    public async updateAllStatus() {

        try {
            if (!this.keyLights) {
                return;
            }
            for (var _i = 0; _i < this.keyLights.length; _i++) {
                let light = this.keyLights[_i]
                let port = light.port;
                let ip = light.ip;
                let optionsCall = await get(`http://${light.ip}:${light.port}/elgato/lights`);
                let newOptions: KeyLightOptions = await JSON.parse(optionsCall);
                let diff = false;
                if (light.options) {
                    if (newOptions.numberOfLights != light.options.numberOfLights) diff = true;
                    else {
                        newOptions.lights.forEach((l, i) => {
                            if (light.options && light.options.lights[i]) {
                                let l2 = light.options.lights[i]

                                if (l.brightness !== l2.brightness) diff = true;
                                if (l.on !== l2.on) diff = true;
                                if (l.temperature !== l2.temperature) diff = true;
                            }
                        })
                    }
                }
                if (diff) {
                    light.options = newOptions;
                    this.emit('updatedLight', light);
                }
            }
        } catch (err) {
            console.error("ERROR while updating lights")
            console.error(err)
        }
    }
    /**
     * Adds a key light instance to our current array
     *
     * @private
     * @param {Service} service
     * @memberof ElgatoLightAPI
     */
    private async addKeylight(service: any) {
        let keyLight: KeyLight = {
            ip: service['referer'].address,
            port: service.port,
            name: service.name
        }

        try {
            //Grab our keylights settings, info, and current options
            let settingsCall = await get(`http://${keyLight.ip}:${keyLight.port}/elgato/lights/settings`);
            keyLight.settings = await JSON.parse(settingsCall);

            let infoCall = await get(`http://${keyLight.ip}:${keyLight.port}/elgato/accessory-info`);
            keyLight.info = await JSON.parse(infoCall);

            let optionsCall = await get(`http://${keyLight.ip}:${keyLight.port}/elgato/lights`);
            keyLight.options = await JSON.parse(optionsCall);

            //Push the keylight to our array and emit the event
            this.keyLights.push(keyLight);
            this.emit('newLight', keyLight);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Updates a light to the given options
     *
     * @param {KeyLight} light
     * @param {KeyLightOptions} options
     * @returns {Promise<any>}
     * @memberof ElgatoLightAPI
     */
    public async updateLightOptions(light: KeyLight, options: KeyLightOptions): Promise<any> {
        return new Promise(async (resolve, reject) => {
            light.options = options;
            try {
                await put(`http://${light.ip}:${light.port}/elgato/lights`, {
                    body: JSON.stringify(options)
                });
                this.emit('updatedLight', light)
                return resolve();
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * Updates all lights to the given options
     *
     * @param {KeyLightOptions} options
     * @returns {Promise<any>}
     * @memberof ElgatoLightAPI
     */
    public async updateAllLights(options: KeyLightOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            for (let x = 0; x < this.keyLights.length; x++) {
                this.updateLightOptions(this.keyLights[x], options).catch(e => {
                    return reject(e);
                });
            }

            return resolve();
        });
    }
}