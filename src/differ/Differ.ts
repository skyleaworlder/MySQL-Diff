
/**
 * Comparer<T>
 * 所有 data model 都要实现的接口。因为所有 model 都是可以比较的。
 * table / column / key / constraint 都需要支持。
 */
export interface Comparer<T> {
  compareWith(another: T): Object
}


/**
 * TarSrc 用来存 Diff。
 */
export class TarSrc {
  tar: any;
  src: any;

  constructor(tar: any, src: any) {
    this.tar = tar;
    this.src = src;
  }
}
