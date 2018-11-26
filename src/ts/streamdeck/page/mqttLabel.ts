import { MqttClient } from "mqtt";
import { StateSwitchLabel } from "./simpleLabels";

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
