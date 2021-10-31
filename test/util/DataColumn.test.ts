import { processTable } from "@/lexer/Processor"
import { DataColumnOptions } from "@/model/DataColumn"
import { StorageType } from "@/model/Enum"
import { splitSQL } from "@/util/Common"
import { fetchDataColumnName, fetchDataColumnOptions, fetchDataColumnType } from "@/util/DataColumn"

test('fetch data column', () => {
  let test_case = [
    {input: "  `id` int unsigned NOT NULL /*!50606 STORAGE MEMORY */ AUTO_INCREMENT /*!80023 INVISIBLE */ COMMENT 'id',", expect: {
      name: "id", type: "int unsigned", opts: new DataColumnOptions(true, null, false, true, "id", "", StorageType.MEMROY)
    }},
    {input: "  `c_id` int NOT NULL /*!50606 STORAGE DISK */,", expect: {
      name: "c_id", type: "int", opts: new DataColumnOptions(true, null, true, false, "", "", StorageType.DISK)
    }},
    {input: "  `name` varchar(62) NOT NULL /*!50606 STORAGE MEMORY */ DEFAULT '' /*!80023 INVISIBLE */,", expect: {
      name: "name", type: "varchar(62)", opts: new DataColumnOptions(true, "''", false, false, "", "", StorageType.MEMROY)
    }},
    {input: "  `kkk` longtext COLLATE utf8mb4_general_ci COMMENT 'kkk',", expect: {
      name: "kkk", type: "longtext", opts: new DataColumnOptions(false, null, true, false, "kkk", "utf8mb4_general_ci", StorageType.EMPTY)
    }}
  ]
  test_case.forEach(t_case => {
    let words: Array<String> = t_case.input.trimLeft().split(" ");
    const data_col_name = fetchDataColumnName(words[0]);
    const data_col_type = fetchDataColumnType(words);
    const data_col_options = fetchDataColumnOptions(words);
    expect(data_col_name).toBe(t_case.expect.name);
    expect(data_col_type).toBe(t_case.expect.type);
    expect(data_col_options).toEqual(t_case.expect.opts);
  })
})


test("compare datacolumn", () => {
  let input_1 = "CREATE TABLE `tbl_a` (\n\
    `id` int NOT NULL AUTO_INCREMENT,\n\
    `a1` int DEFAULT NULL,\n\
    `a2` int DEFAULT NULL,\n\
    `a3` int DEFAULT NULL\n\
  );";
  let input_2 = "CREATE TABLE `tbl_b` (\n\
    `id` int NOT NULL AUTO_INCREMENT,\n\
    `a1` varchar(63) DEFAULT NULL,\n\
    `a4` int DEFAULT NULL\n\
  );";

  let tbl_a = processTable(splitSQL(input_1));
  let tbl_b = processTable(splitSQL(input_2));
  console.log(tbl_a, tbl_b);
  let diffs = tbl_a.columns.compareTo(tbl_b.columns);
  let trans = tbl_a.columns.transform(tbl_a.table_name, diffs);
  console.log(trans);
})
