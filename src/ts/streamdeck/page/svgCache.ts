import { Md5 } from "ts-md5";


export class SVGCache {
  public cache: Map<string, any> = new Map();

  public isCached(svgSrc: string): any {
    const key = Md5.hashStr(svgSrc).toString();
    return this.cache.has(key);
  }
  public retrieve(svgSrc: string): any {
    const key = Md5.hashStr(svgSrc).toString();
    return this.cache.get(key);
  }
  public cacheImage(src: string, img: any): void {
    const key = Md5.hashStr(src).toString();
    this.cache.set(key, img);
  }
}
