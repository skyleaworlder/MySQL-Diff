import { DataColumnOptions } from "@/model/DataColumn";
import { StorageType } from "@/model/Enum";
import { removeArmor } from "./Common";

export function fetchDataColumnName(str: String): String {
  const [data_col_name, success] = removeArmor(str, "`", "`");
  if (!success) {
    console.error("fetchDataColumnName error: removeArmor failed, error!!!");
    return "";
  }
  return data_col_name;
}


export function fetchDataColumnOptions(words: Array<String>): DataColumnOptions {
  let data_col_options = new DataColumnOptions();
  let pos_arr: Array<number> = [2];

  // COLLATE
  const collate_beg = words.indexOf("COLLATE", Math.max(...pos_arr));
  pos_arr.push(collate_beg);
  if (collate_beg >= 0) {
    data_col_options.collate = words[collate_beg + 1];
  }
  // NOT NULL
  const not_null_beg = words.indexOf("NOT", Math.max(...pos_arr));
  pos_arr.push(not_null_beg);
  if (not_null_beg < 0) {;} else if (words[not_null_beg + 1] == "NULL") {
    data_col_options.not_null = true;
  } else {
    console.error("fetchDataColumnOptions error: no 'NULL' behind the 'NOT', error!!!");
    return data_col_options;
  }
  // STORAGE
  const storage_beg = words.indexOf("STORAGE", Math.max(...pos_arr));
  pos_arr.push(storage_beg);
  if (storage_beg < 0) {;} else if (words[storage_beg + 1] == "DISK") {
    data_col_options.storage = StorageType.DISK;
  } else if (words[storage_beg + 1] == "MEMORY") {
    data_col_options.storage = StorageType.MEMROY;
  } else {
    console.error("fetchDataColumnOptions error: no storage type behind the 'STORAGE'");
    return data_col_options;
  }
  // DEFAULT
  const default_val_beg = words.indexOf("DEFAULT", Math.max(...pos_arr));
  pos_arr.push(default_val_beg);
  if (default_val_beg < 0) {;} else if (words[default_val_beg + 1] == "NULL") {;} else {
    data_col_options.default_val = words[default_val_beg + 1];
  }
  // AUTO_INCREMENT
  const auto_increment_pos = words.indexOf("AUTO_INCRAMENT");
  if (auto_increment_pos >= 0) {
    data_col_options.auto_increment = true;
  }
  // INVISIBLE
  const invisible_pos = words.indexOf("INVISIBLE", Math.max(...pos_arr));
  pos_arr.push(invisible_pos);
  if (invisible_pos >= 0) {
    data_col_options.visible = false;
  }
  // COMMENT
  const comment_beg = words.indexOf("COMMENT", Math.max(...pos_arr));
  pos_arr.push(comment_beg);
  if (comment_beg >= 0) {
    const [content, success] = removeArmor(words[comment_beg + 1], "'", "'");
    if (!success) {
      console.error("fetchDataColumnOptions error: no content behind 'COMMENT', error!!!");
      return data_col_options;
    }
  }
  return data_col_options;
}
