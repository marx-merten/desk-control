// tslint:disable:max-line-length
// tslint:disable:max-classes-per-file

import { Color, get as colorGet, to as colorTo } from "color-string";
import sharp = require("sharp");
import { DeckConfig } from "../../deckConfig";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

import * as fs from "fs";
import * as path from "path";

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
            <text id="label" font-family="monospace" font-size="14" font-weight="bold" fill="###COLOR###">
                <tspan x="###POS###" y="63">###LABEL###</tspan>
            </text>
        </g>
    </g>
</svg>
`;
export class SvgLabel extends DeckButtonLabel {
  public color = colorGet("#000000")!.value;
  public background = colorGet("#5886AA")!.value;

  public svgTemplate: string;

  constructor(template = BASIC_TEMPLATE) {
    super();
    this.svgTemplate = template;
  }

  public prepareSvg(svg: string): string {
    return svg
      .replace("###BACKGROUND###", colorTo.hex(this.background))
      .replace("###COLOR###", colorTo.hex(this.color));
  }
  public draw(key: StreamKeyWrapper): void {
    const im = sharp(Buffer.from(this.prepareSvg(this.svgTemplate)));

    im.resize(DeckConfig.ICON_SIZE, DeckConfig.ICON_SIZE)
      .flatten()
      .raw()
      .toBuffer()
      .then((buffer: any) => {
        return key.fillImage(buffer);
      });
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
    svgResult = svgResult
      .replace("###ICON###", "data:image/png;base64," + iconBase64)
      .replace("###LABEL###", this.label);
    const factor = (72 - 2.4 * 2) / 8 / 2;
    const pos = 36.5 - factor * this.label.length;

    console.log("POS:" + pos);
    return svgResult.replace("###POS###", "" + pos);
  }
  private loadIcon(filename: string): string {
    const data = fs.readFileSync(path.resolve(filename));
    return data.toString("base64");
  }
}
