export class DataUtil {
  static random(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start)) + start;
  }
  static range(start: number, end: number = 0): ReadonlyArray<number> {
    return [...Array<number>(end - start + 1).keys()].map(i => i + start);
  }
}
