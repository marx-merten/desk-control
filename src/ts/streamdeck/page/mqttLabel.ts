import { MqttClient } from "mqtt";
import { StateSwitchLabel } from "./simpleLabels";

export class MqttLabel extends StateSwitchLabel {
  public mqtt: MqttClient;
  public stateTopic: string;
  constructor(mqtt: MqttClient, stateTopic: string) {
    super();
    this.mqtt = mqtt;
    this.stateTopic = stateTopic;
    mqtt.subscribe(stateTopic);
    mqtt.on("message", (topic, content) => {
      if (topic === this.stateTopic) {
        this.state = content.toString();
      }
    });
  }
}
