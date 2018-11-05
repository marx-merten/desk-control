export class DataUtil {
  static range(start: number, end: number = 0): ReadonlyArray<number> {
    return [...Array<number>(end - start + 1).keys()].map(i => i + start);
  }
}
