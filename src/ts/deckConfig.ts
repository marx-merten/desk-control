import { Color, get as colorGet, to as colorTo } from "color-string";

export class DeckConfig {
  public static width = 5;
  public static height = 3;
  public static numberOfButtons = DeckConfig.width * DeckConfig.height;
  public static clickMinimumTimeMs = 10;
  public static ICON_SIZE = 72;
  public static kvmHost = "vm0808hb:23";
  public static kvmUser = "deskkvm";
  public static kvmPassword = "kvmkvm";
  public static colDefault = colorGet("lightsteelblue")!.value;
  public static colDefaultHighlight = colorGet("lightskyblue")!.value;
  public static colDefaultFalse = colorGet("lightcoral")!.value;
  public static colDefaultTrue = colorGet("limegreen")!.value;
  public static colDefaultInactive = colorGet("dimgrey")!.value;
  public static colDefaultActive = colorGet("deepskyblue")!.value;
}
