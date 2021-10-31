import { KeyType } from "@/model/Enum";
import { KeyOptions, PrimaryKey } from "@/model/Key";
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


/**
 * composePrimaryKeyName
 * 一般来说，主键是没有 name 的。
 * 由于 Keys 中将主键作为元素，所以也需要生成一个 name 作为 Map 中的 key
 * @param pk 主键
 */
export function composePrimaryKeyName(pk: PrimaryKey): string {
  return (KeyType.PRIMARY_KEY + " " + pk.key_part.reduce((prev, cur) => (prev.toString() + cur)));
}


/**
 * composeKeyPart
 * ["name_a", "name_b", "name_c"...] => "`name_a`, `name_b`, `name_c`..."
 * @param key_part 传入的 key_part，或者 ref_col 等字段
 */
export function composeKeyPart(key_part: Array<String>): string {
  return key_part
    .map((elem) => (`\`${elem}\``))
    .reduce((prev, cur) => (prev + `, ${cur}`));
}
