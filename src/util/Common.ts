
/**
 * getStrSurroundWith
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
  return getStrSurroundWithAB(str, surround, surround, position);
}


/**
 * getStrSurroundWithBracket
 * @param str 传入的字符串，这里基本是 ddl；
 * @param position 偏移量，从第几个开始找；
 * @returns 总共是四个返回值：
 * 1. 包裹符包裹的字符串；
 * 2. 前包裹符的偏移量；
 * 3. 后包裹符的偏移量；
 * 4. 是否越界。true 表示越界，false 表示没有。如果取到了字符串，肯定就没越界。
 */
export function getStrSurroundWithBracket(str: String, position: number): [string, number, number, boolean] {
  return getStrSurroundWithAB(str, "(", ")", position);
}


/**
 * includeCap 对传入的 str 做了统一的大写处理
 * @param str 传入的字符串，这里基本是 ddl
 * @param to_find 需要判断是否存在的字符串
 * @returns 存在返回 true，否则返回 false
 */
export function includeCap(str: String, to_find: string): boolean {
  return str.toUpperCase().includes(to_find);
}


/**
 * getItems 获得一个字符串中的 items
 * @param str 传入的字符串，这里基本是 ddl
 * @param wrapper item 的包裹符，这里一般是 "`"
 * @returns 字符串数组
 */
export function getItems(str: String, wrapper: string = "`"): Array<String> {
  let res: Array<String> = [];
  for (let index = 0; index < str.length; index++) {
    let col: String, out_of_bound: boolean;
    [col, , index, out_of_bound] = getStrSurroundWith(str, wrapper, index);
    if (col == "" && out_of_bound) {
      break;
    }
    res.push(col);
  }
  return res;
}


function getStrSurroundWithAB(str: String, A: string, B: string, position: number): [string, number, number, boolean] {
  const beg: number = str.indexOf(A, position);
  // 如果找不到，那就返回空字符串和 -1。
  if (beg < 0) {
    return ["", -1, -1, true];
  }
  const end: number = str.indexOf(B, beg + 1);
  // 如果找不到，那就返回空字符串和 -1。
  if (end < 0) {
    return ["", -1, -1, true];
  }
  return [str.slice(beg + 1, end), beg, end, false];
}
