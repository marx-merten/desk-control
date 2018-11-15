// tslint:disable:max-line-length

import { Color, get as colorGet, to as colorTo } from "color-string";
import sharp = require("sharp");
import { DeckConfig } from "../../deckConfig";
import { DeckButtonLabel } from "../deckButtonLabel";
import { StreamKeyWrapper } from "../deckWrapper";

const BASIC_TEMPLATE = `
<svg width="72px" height="72px" viewBox="0 0 72 72" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group">
            <rect id="Frame" fill="#000000" x="0" y="0" width="72" height="72"></rect>
            <rect id="Rectangle" fill="###BACKGROUND###" x="3" y="3" width="66" height="66" rx="11"></rect>
            <path d="M3.5,50.5 L68.5,50.5" id="Line" stroke="###COLOR###" stroke-width="3" stroke-linecap="square"></path>
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

    // tslint:disable-next-line:no-console
    console.log(colorTo.hex(this.background));

    im.resize(DeckConfig.ICON_SIZE, DeckConfig.ICON_SIZE)
      .flatten()
      .raw()
      .toBuffer()
      .then((buffer: any) => {
        return key.fillImage(buffer);
      });
  }
}
