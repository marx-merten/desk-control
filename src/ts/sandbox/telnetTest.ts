// tslint:disable:no-console
// tslint:disable-next-line:no-var-requires
let et: any = require("expect-telnet");

// Typical session Enter Username:leika
// Password:********
// Password Successful
// Connection to VM0808HB is established
// > RO 01
// Input Port 01 is connected to Output Port 01
// ctrl+q to end

let done = false;
et(
  "vm0808hb:23",
  [
    { expect: "Enter Username:", send: "leika\r" },
    { expect: "Password:", send: "wunedowe\r" },
    { expect: ">", send: "RO 01\r" },
    {
      expect: ">",
      out: (output: any) => {
        done = true;
        console.log(output);
      },
      send: "\x11",
    },
  ],
  { exit: true },
  (err: string) => {
    if (err.toString().includes("ECONNRESET") && done) {
      return;
    } else {
      console.log("Error happened");
      console.log(err);
    }
  },
);
