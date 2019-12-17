import { MqttClient } from "mqtt";
import { StateSwitchLabel } from "./simpleLabels";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";
import { DeckButton } from "../deckButton";

export class MqttLabel extends StateSwitchLabel {
  public mqtt: MqttClient;
  public stateTopic: string;
  public activeSetting = false;
  public lastState: string;
  constructor(mqtt: MqttClient, stateTopic: string, activeTopic?: string) {
    super();
    this.mqtt = mqtt;
    this.stateTopic = stateTopic;
    this.lastState = "";
    mqtt.subscribe(stateTopic);
    if (activeTopic !== undefined) { mqtt.subscribe(activeTopic); }
    mqtt.on("message", (topic, content) => {
      if (activeTopic !== undefined && topic === activeTopic) {
        if (content.toString() === "true") {
          this.lastState = this.state!;
          this.state = "__active__";
          this.activeSetting = true;
        }
        if (content.toString() === "false") {
          this.activeSetting = false;
          this.state = this.lastState;
        }
      }
      if (topic === this.stateTopic) {
        this.lastState = content.toString();
        if (!this.activeSetting) {
          this.state = this.lastState;
        }
      }
    });
  }
}

export class MqttCallbackLabel extends DeckButtonLabel {
  markDirty() {
    if (this.button !== undefined) {
      if (this.button.active) {
        this.button.markDirty();
      }
    }
  }

  mqtt: MqttClient;
  public activeLabel: DeckButtonLabel;
  stateTopic: string;
  public callbackFunction: (topic: any, content: any) => boolean;

  constructor(mqtt: MqttClient, stateTopic: string, activeLabel: DeckButtonLabel, callbackFunction: (topic: any, content: any) => boolean) {
    super();
    this.mqtt = mqtt;
    this.stateTopic = stateTopic;
    this.activeLabel = activeLabel;
    this.callbackFunction = callbackFunction;
    if (stateTopic !== undefined) { mqtt.subscribe(stateTopic); }
    mqtt.on("message", (topic, payload) => {

      if (topic === stateTopic) {
        if (this.callbackFunction(topic, payload)) {
          this.markDirty();
        }
      }
    })
  }

  public draw(key: StreamKeyWrapper): void {
    this.activeLabel.draw(key);
  }

}