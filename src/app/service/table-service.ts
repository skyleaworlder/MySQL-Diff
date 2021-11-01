import { processTable } from "@/lexer/Processor";

export default class TableService {
  transform_table = (src: String, tar: String): Array<String> => {
    let src_lines = src.split("\n").filter(Boolean);
    let tar_lines = tar.split("\n").filter(Boolean);
    let [src_tbl, ] = processTable(src_lines);
    let [tar_tbl, ] = processTable(tar_lines);
    return src_tbl.transform(src_tbl.compareTo(tar_tbl));
  }
}
