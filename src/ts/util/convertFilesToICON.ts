// tslint:disable:no-console
import { DataUtil } from "../utility";

import * as fs from "fs";
import * as path from "path";
function loadIcon(filename: string): string {
  const data = fs.readFileSync(path.resolve(filename));
  return data.toString("base64");
}

const s = loadIcon(process.argv[2]);

let name = process.argv[2];
name = name.replace("./", "ICON_");
name = name.replace(".png", "");
console.log(DataUtil.wrapString("export const " + name + " = `data:image/png;base64," + s + "`", 70).join("\n"));
