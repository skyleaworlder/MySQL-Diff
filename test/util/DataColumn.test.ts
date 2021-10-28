import { DataColumnOptions } from "@/model/DataColumn"
import { StorageType } from "@/model/Enum"
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
    console.log("wordword:", words)
    const data_col_name = fetchDataColumnName(words[0]);
    const data_col_type = fetchDataColumnType(words);
    const data_col_options = fetchDataColumnOptions(words);
    expect(data_col_name).toBe(t_case.expect.name);
    expect(data_col_type).toBe(t_case.expect.type);
    expect(data_col_options).toEqual(t_case.expect.opts);
  })
})
