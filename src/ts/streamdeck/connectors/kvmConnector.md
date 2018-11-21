# KVM Connector

This Connector using the telnet API provided by the Aten Matrix Switches (here vm0808hb)

## Sample Code

```
import { KVM_RI_RESULT, KVM_RO_RESULT, KvmConnector } from "../streamdeck/connectors/kvmConnector";

const cmd = new KvmConnector("vm0808hb:23", "deskkvm", "kvmkvm");
cmd
  .addCommand("SS 01,01", (res) => {
    console.log(res);
  })

  .addCommand(
    "RO 01",
    (res) => {
      console.log(res![2]);
    },
    KVM_RO_RESULT,
  )
  .addCommand(
    "RO 02",
    (res) => {
      console.log(res![2]);
    },
    KVM_RO_RESULT,
  )
  .addCommand(
    "RO 03",
    (res) => {
      console.log(res![2]);
    },
    KVM_RO_RESULT,
  )
  .finish();

cmd.execute((err: string) => {
  console.log(err);
});
```
