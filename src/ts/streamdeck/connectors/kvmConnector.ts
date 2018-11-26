// tslint:disable:max-classes-per-file
// tslint:disable-next-line:no-var-requires
const et: any = require("expect-telnet");

export const KVM_RO_RESULT = "Input Port (.+) is connected to Output Port (.+)";
export const KVM_RI_RESULT = "Output Port (.+) is connected to Input Port (.+)";

export class KvmConnector {
  public host: string;
  public finished: boolean = false;
  private username: string;
  private password: string;
  private nextOutputCB?: (out: any) => void;

  private commands: any[] = [];
  constructor(host: string, user: string, password: string) {
    this.host = host;
    this.username = user;
    this.password = password;
    this.commands.push({ expect: "Enter Username:", send: user + "\r" });
    this.commands.push({ expect: "Password:", send: password + "\r" });
  }

  public clear() {
    this.commands = [];
    this.commands.push({
      expect: "Enter Username:",
      send: this.username + "\r",
    });
    this.commands.push({ expect: "Password:", send: this.password + "\r" });
  }

  public addCommand(
    cmd: string,
    resultCb?: (results?: any[]) => void,
    regexp?: string,
  ): this {
    const c: any = { expect: ">", send: cmd + "\r" };
    if (this.nextOutputCB !== undefined) {
      c.out = this.nextOutputCB;
      this.nextOutputCB = undefined;
    }
    this.commands.push(c);
    if (resultCb !== undefined) {
      if (regexp === undefined) {
        this.nextOutputCB = (out: any) => {
          const o = [out];
          resultCb(o);
        };
      } else {
        this.nextOutputCB = (out: any) => {
          const re = new RegExp(regexp);
          const results = re.exec(out.toString());
          if (results !== null) {
            resultCb(results.map((e) => e));
          } else {
            resultCb(undefined);
          }
        };
      }
    }
    return this;
  }

  public execute(errorCb: (error: any) => void): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.addCommand("\r", (res) => {
        this.finished = true;
        resolve(0);
      });
      this.finish();
      this.finished = false;
      et(this.host, this.commands, (error: any) => {
        if (error === undefined) {
          // tslint:disable-next-line:no-console
          console.log("error undefined");
        } else {
          if (error.toString().includes("ECONNRESET") && this.finished) {
            return;
          } else {
            errorCb(error);
            reject();
          }
        }
      });
    });
  }

  private finish(): this {
    this.addCommand("\r", (a: any) => {
      this.finished = true;
    });
    const c: any = { expect: ">", send: "\x11" };
    if (this.nextOutputCB !== undefined) {
      c.out = this.nextOutputCB;
      this.nextOutputCB = undefined;
    }
    this.commands.push(c);
    return this;
  }
}
