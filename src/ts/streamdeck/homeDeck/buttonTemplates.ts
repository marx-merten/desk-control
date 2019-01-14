import { MqttClient } from "mqtt";
import { DeckConfig } from "../../deckConfig";
import { KEY_CLICK } from "../deckStack";
import { StreamKeyWrapper } from "../deckWrapper";
import { ICONS } from "../page/logos";
import { MqttLabel } from "../page/mqttLabel";
import { SimpleButton } from "../page/simpleDeckButton";
import { IconLabel } from "../page/svgLabel";
import { IDeckButton } from "./../deckButton";

export function createMqttIconStateButton(
  mqtt: MqttClient,
  name: string,
  label: string,
  topic: string,
  states: Array<{ state: string; icon: string; lbl?: string }>,
  setTopic = topic,
  activeMoveTopic?: string,
  color = DeckConfig.colDefault,
): IDeckButton {
  const lbl = new MqttLabel(mqtt, topic, activeMoveTopic);
  lbl.default = new IconLabel(ICONS.WAIT, "wait").setBackground(DeckConfig.colDefaultInactive);

  states.forEach((st) => {
    lbl.addState(st.state, new IconLabel(st.icon, st.lbl === undefined ? label : st.lbl));
  });

  lbl.addState("__active__", new IconLabel(ICONS.WAIT, "...").setBackground(DeckConfig.colDefaultActive));
  const b = new SimpleButton(name, lbl);

  b.on(KEY_CLICK, (key: StreamKeyWrapper) => {
    const s = lbl.state;

    for (const st of lbl.states.keys()) {
      if (s !== st) {
        lbl.state = "__active__";
        mqtt.publish(setTopic, st);
        break;
      }
    }
  });
  return b;
}
export function createMqttPowerStateButton(
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
    .addState("___UNDEFINED___", new IconLabel(icon, location).setBackground(DeckConfig.colDefaultInactive))
    .addState("false", new IconLabel(iconOff, location).setBackground(DeckConfig.colDefaultFalse))
    .addState("true", new IconLabel(icon, location).setBackground(DeckConfig.colDefaultTrue));

  const b = new SimpleButton(name, lbl);
  b.on(KEY_CLICK, (key: StreamKeyWrapper) => {
    const newState = lbl.state === "true" ? "false" : "true";
    mqqt.publish(setTopic, newState);
  });
  return b;
}

export function createMqttDimStateButton(
  mqtt: MqttClient,
  name: string,
  topic: string,
  increment: number,
  label?: string,
  setTopic = topic,
  icon = ICONS.BULB,
  min = 0,
  max = 100,
) {
  const lbl = new IconLabel(icon, label);
  const b = new SimpleButton(name, lbl);
  let currentLevel = 0;

  mqtt.subscribe(topic);
  mqtt.on("message", (t, load) => {
    if (t === topic) {
      currentLevel = Number(load.toString());
    }
  });

  b.on(KEY_CLICK, () => {
    let newLevel = currentLevel + increment;
    newLevel -= newLevel % increment;
    if (newLevel < min) {
      newLevel = min;
    }
    if (newLevel > max) {
      newLevel = max;
    }

    mqtt.publish(setTopic, newLevel.toString());
  });

  return b;
}
