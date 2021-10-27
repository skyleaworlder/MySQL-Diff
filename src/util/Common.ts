
/**
 *
 * @param str 传入的字符串，这里基本是 ddl；
 * @param surround 包裹符；
 * @param position 偏移量，从第几个开始找；
 * @returns 总共是四个返回值：
 * 1. 包裹符包裹的字符串；
 * 2. 前包裹符的偏移量；
 * 3. 后包裹符的偏移量；
 * 4. 是否越界。true 表示越界，false 表示没有。如果取到了字符串，肯定就没越界。
 */
export function getStrSurroundWith(str: String, surround: string, position: number): [string, number, number, boolean] {
  const beg: number = str.indexOf(surround, position);
  // 如果找不到，那就返回空字符串和 -1。
  if (beg < 0) {
    return ["", -1, -1, true];
  }
  const end: number = str.indexOf(surround, beg + 1);
  // 如果找不到，那就返回空字符串和 -1。
  if (end < 0) {
    return ["", -1, -1, true];
  }
  return [str.slice(beg + 1, end), beg, end, false];
}
