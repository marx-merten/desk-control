import { MqttClient } from "mqtt";
import { DeckConfig } from "../../deckConfig";
import { ICONS } from "../page/logos";
import { MqttLabel } from "../page/mqttLabel";
import { SimpleButton } from "../page/simpleDeckButton";
import { IconLabel } from "../page/svgLabel";
import { IDeckButton } from "./../deckButton";

export function createMqttStateButton(
  mqqt: MqttClient,
  name: string,
  location: string,
  topic: string,
  setTopic = topic,
  icon = ICONS.BULB,
  iconOff = icon,
): IDeckButton {
  const lbl = new MqttLabel(mqqt, topic);
  lbl
    .addState(
      "___UNDEFINED___",
      new IconLabel(icon, location).setBackground(DeckConfig.colDefaultInactive),
    )
    .addState(
      "false",
      new IconLabel(iconOff, location).setBackground(DeckConfig.colDefaultFalse),
    )
    .addState(
      "true",
      new IconLabel(icon, location).setBackground(DeckConfig.colDefaultTrue),
    );

  return new SimpleButton(name, lbl);
}
