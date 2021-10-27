import { Table } from "@/model/Table";
import { readFileSync } from "fs";

let lines = readFileSync("test/sql/test_constraint.sql", "utf-8").split("\n").filter(Boolean)
console.log(lines)

function processTable(table_ddl: Array<String>): Table {
  return new Table([], [], []);
}

let tbl_lst: Array<Table> = [];

for (let index = 0; index < lines.length; index++) {
  const line = lines[index].trim();

  // SQL Script one-line comment
  if (line.startsWith("--")) {
    continue;
  }

  if (line.toUpperCase().indexOf("CREATE TABLE")) {
    let jndex = index;
    for (; jndex < lines.length; jndex++) {
      // 需要考虑 Table Options，所以并不都是以 ");" 结尾
      if (lines[jndex].trim().endsWith(";")) {
        break;
      }
    }
    let table_ddl: Array<String> = lines.slice(index, jndex + 1);
    tbl_lst.push(processTable(table_ddl));
  }
}
