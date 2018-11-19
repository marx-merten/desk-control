import { KVM_RI_RESULT, KVM_RO_RESULT, KvmConnector } from "../streamdeck/connectors/kvmConnector";
// tslint:disable:no-console

// Typical session Enter Username:leika
// Password:********
// Password Successful
// Connection to VM0808HB is established
// > RO 01
// Input Port 01 is connected to Output Port 01
// ctrl+q to end

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
