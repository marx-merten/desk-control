// tslint:disable:max-line-length
// tslint:disable:max-classes-per-file

import { Color, get as colorGet, to as colorTo } from "color-string";
import sharp = require("sharp");
import { DeckConfig } from "../../deckConfig";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

import * as fs from "fs";
import * as path from "path";
import { SVGCache } from "./svgCache";

const BASIC_TEMPLATE = `
<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="3" y="3" width="66" height="66" rx="11"></rect>
        </g>
    </g>
</svg>
`;

const ICON_TEMPLATE = `
<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="0" y="0" width="72" height="72" rx="11"></rect>
        </g>
        <image x="12" y="12" width="48" height="48" xlink:href="###ICON###"></image>
    </g>
</svg>
`;

const ICON_TEMPLATE_LABEL = `

<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="0" y="0" width="72" height="72" rx="11"></rect>
            <image id="add-1" x="17" y="6" width="39" height="39" xlink:href="###ICON###"></image>
            <text id="label" font-family="monospace" font-size="14" font-weight="normal" fill="###COLOR###">
                <tspan x="###POS###" y="63">###LABEL###</tspan>
            </text>
        </g>
    </g>
</svg>
`;

const TEMPLATE_CHAR = `
<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="0" y="0" width="72" height="72" rx="11"></rect>
            <rect id="FRAME" stroke="###FRAME-COLOR###" stroke-width="5" x="9" y="9" width="54" height="54"></rect>
             <text id="1" font-family="monospace" font-size="50" font-weight="bold" fill="###COLOR###">
                <tspan x="21" y="49">###TXT###</tspan>
            </text>
        </g>
    </g>
</svg>
`;

const TEMPLATE_CHAR_LABEL = `
<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="0" y="0" width="72" height="72" rx="11"></rect>
            <text id="12345678" font-family="monospace" font-size="14" font-weight="normal" fill="###COLOR###">
                <tspan x="###POS###" y="63">###LABEL###</tspan>
            </text>
            <rect id="FRAME" stroke="###FRAME-COLOR###" stroke-width="2" x="15" y="5" width="43" height="43"></rect>
            <text id="1" font-family="monospace" font-size="40" font-weight="normal" fill="###COLOR###">
                <tspan x="25" y="39">###TXT###</tspan>
            </text>
        </g>
    </g>
</svg>
`;
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class SvgLabel extends DeckButtonLabel {
  private static cache = new SVGCache();
  public color = colorGet("black")!.value;
  public background = colorGet("lightsteelblue")!.value;

  public svgTemplate: string;

  constructor(template = BASIC_TEMPLATE) {
    super();
    this.svgTemplate = template;
    this.delayRecache(200);
  }

  public async delayRecache(ms: number) {
    await wait(ms);
    this.precache();
  }
  public precache(): any {
    const svgSrc = this.prepareSvg(this.svgTemplate);
    if (!SvgLabel.cache.isCached(svgSrc)) {
      const im = sharp(Buffer.from(svgSrc));
      im.resize(DeckConfig.ICON_SIZE, DeckConfig.ICON_SIZE)
        .flatten()
        .raw()
        .toBuffer()
        .then((buffer: any) => {
          SvgLabel.cache.cacheImage(svgSrc, buffer);
        });
    }
  }

  public prepareSvg(svg: string): string {
    return svg
      .replace(/###BACKGROUND###/g, colorTo.hex(this.background))
      .replace(/###COLOR###/g, colorTo.hex(this.color));
  }

  public draw(key: StreamKeyWrapper): void {
    const svgSrc = this.prepareSvg(this.svgTemplate);
    if (SvgLabel.cache.isCached(svgSrc)) {
      const buffer = SvgLabel.cache.retrieve(svgSrc)!;
      key.fillImage(buffer);
    } else {
      const im = sharp(Buffer.from(svgSrc));
      im.resize(DeckConfig.ICON_SIZE, DeckConfig.ICON_SIZE)
        .flatten()
        .raw()
        .toBuffer()
        .then((buffer: any) => {
          SvgLabel.cache.cacheImage(svgSrc, buffer);
          return key.fillImage(buffer);
        });
    }
  }
}
export class CharacterLabel extends SvgLabel {
  public label: string;
  public txt: string;
  public disableFrame: boolean;
  constructor(txt: string, label = "", disableFrame = false) {
    if (label !== "") {
      super(TEMPLATE_CHAR_LABEL);
    } else {
      super(TEMPLATE_CHAR);
    }
    this.label = label;
    this.txt = txt;
    this.disableFrame = disableFrame;
  }
  public prepareSvg(svg: string): string {
    let svgResult = super.prepareSvg(svg);

    const factor = (72 - 2.4 * 2) / 8 / 2;
    const pos = 36.5 - factor * this.label.length;
    svgResult = svgResult
      .replace(/###TXT###/g, this.txt)
      .replace(/###LABEL###/g, this.label)
      .replace(/###FRAME-COLOR###/g, this.disableFrame ? colorTo.hex(this.background) : colorTo.hex(this.color))
      .replace(/###POS###/g, "" + pos);

    console.log(svgResult);
    return svgResult;
  }
}
export class IconLabel extends SvgLabel {
  public label: string;
  public icon: string;

  constructor(iconPath: string, label = "") {
    if (label !== "") {
      super(ICON_TEMPLATE_LABEL);
    } else {
      super(ICON_TEMPLATE);
    }
    this.label = label;
    this.icon = iconPath;
  }
  public prepareSvg(svg: string): string {
    let svgResult = super.prepareSvg(svg);
    const iconBase64 = this.loadIcon(this.icon);
    svgResult = svgResult.replace(/###ICON###/g, iconBase64).replace(/###LABEL###/g, this.label);
    const factor = (72 - 2.4 * 2) / 8 / 2;
    const pos = 36.5 - factor * this.label.length;

    return svgResult.replace(/###POS###/g, "" + pos);
  }
  private loadIcon(filename: string): string {
    if (filename.startsWith("data:image/png;base64")) {
      return filename;
    }

    const data = fs.readFileSync(path.resolve(filename));
    return "data:image/png;base64," + data.toString("base64");
  }
}
