
export function fetchTableName(ddl: String): String {
  let name_beg: number = ddl.indexOf("`");
  let name_end: number = ddl.lastIndexOf("`");
  if (name_beg >= 0 && name_end >= 0) {
    return ddl.slice(name_beg + 1, name_end);
  }
  return "";
}
