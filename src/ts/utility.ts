export class DataUtil {
  public static random(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start)) + start;
  }
  public static range(start: number, end: number = 0): ReadonlyArray<number> {
    return [...Array<number>(end - start + 1).keys()].map((i) => i + start);
  }
  public static wrapString(txt: string, lineWidth: number): string[] {
    const erg: string[] = [];
    for (let i = 0; i < txt.length; i += lineWidth) {
      erg.push(txt.substr(i, lineWidth));
    }
    return erg;
  }
}
