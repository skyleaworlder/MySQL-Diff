import { KeyType } from "@/model/Enum";
import { KeyOptions } from "@/model/Key";
import { getStrSurroundWith } from "@/util/Common";

/**
 * fetchKeyType
 * 获取键的类型
 * @param ddl 是定义键的那一行
 * @returns 要么返回键的类型，要么返回一个 null 来表示这一行根本没有定义键
 */
export function fetchKeyType(ddl: String): KeyType | null {
  const ddl_upper_case = ddl.toUpperCase()
  if (ddl_upper_case.indexOf("PRIMARY KEY") >= 0) {
    return KeyType.PRIMARY_KEY;
  } else if (ddl_upper_case.indexOf("UNIQUE KEY") >= 0) {
    return KeyType.UNIQUE_KEY;
  } else if (ddl_upper_case.indexOf("KEY") >= 0) {
    return KeyType.NORMAL_KEY;
  } else {
    return null;
  }
}


/**
 * fetchKeyName
 * 第一个 indexOf 拿键名首 pos-1，第二个 indexOf 肯定是键名尾 pos。（左闭右开）
 * @param ddl 是定义键的那一行
 * @param key_type 是键的类型，虽然说不该传，但我还是写了。如果是 PRIMARY KEY 的话，没有 name。
 * @returns 键的名字
 */
export function fetchKeyName(ddl: String, key_type: KeyType): String {
  if (key_type == KeyType.PRIMARY_KEY) {
    return "";
  }
  let [res,] = getStrSurroundWith(ddl, "`", 0);
  return res;
}


/**
 * fetchKeyPart
 * 获取键下辖的字段名
 * @param ddl 是定义键的那一行
 * @returns 键下辖的表中 columns 的字段名
 */
export function fetchKeyPart(ddl: String): Array<String> {
  const key_part_beg: number = ddl.indexOf("(");
  // 如果 key_part_beg 小于 0，说明这一条 ddl 有问题。
  if (key_part_beg < 0) {
    console.error("fetchKeyPart error: ddl has no key part.");
    return [];
  }

  let key_part: Array<String> = [];
  let key_col_elem: String;
  let out_of_bound: boolean;
  for (let index = key_part_beg; index < ddl.length; index++) {
    [key_col_elem, , index, out_of_bound] = getStrSurroundWith(ddl, "`", index);
    if (out_of_bound) {
      break;
    } else {
      key_part.push(key_col_elem);
    }
  }
  return key_part;
}


/**
 * unmarshalKeyOptions
 * 获取 Key Options（现在只有 COMMENT）
 * @param ddl 是定义键的那一行
 * @returns 键的 options
 */
export function unmarshalKeyOptions(ddl: String): KeyOptions {
  let comment_beg: number = ddl.toUpperCase().indexOf("COMMENT");
  if (comment_beg < 0) {
    return new KeyOptions();
  }
  // comment filled.
  let [comment_content, , , out_of_bound] = getStrSurroundWith(ddl, "'", comment_beg);
  if (out_of_bound) {
    console.error("unmarshalKeyOptions error: no content after 'COMMENT', error!!");
    return new KeyOptions();
  }
  return new KeyOptions(comment_content);
}
