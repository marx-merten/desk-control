import { connect as mqttConnect } from "mqtt";

const m1 = mqttConnect("mqtt://nas:9883");
m1.on("connect", () => {
  // tslint:disable-next-line:no-console
  console.log("Connected");
});

m1.on("message", (subject: string, value: string) => {
  // tslint:disable-next-line:no-console
  console.log("s:" + subject);
  // tslint:disable-next-line:no-console
  console.log("v:" + value);
});

setTimeout(() => {
  // tslint:disable-next-line:no-console
  console.log("XXX");
  //          hm-rpc.1.0001D8A9933FDD.3.STATE
  // m1.publish("hm-rpc/1/0001D8A9933FDD/3/STATE/set", "true");
  m1.subscribe("hm-rpc/1/0001D8A9933FDD/3/STATE");
}, 5000);
