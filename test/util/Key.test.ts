import { processTable } from "@/lexer/Processor";
import { IndexDS, KeyType } from "@/model/Enum";
import { KeyOptions } from "@/model/Key";
import { splitSQL } from "@/util/Common";
import { fetchKeyName, fetchKeyPart, fetchKeyType, unmarshalKeyOptions } from "@/util/Key";

test('fetch key', () => {
  let test_case_npk = [
    {input: "  UNIQUE KEY `name` (`name`, `c_id`),", expect: {
      name: "name", type: KeyType.UNIQUE_KEY, part: ["name", "c_id"], ds: IndexDS.BTREE, ops: new KeyOptions()
    }},
    {input: "KEY `c_id` (`c_id`),", expect: {
      name: "c_id", type: KeyType.NORMAL_KEY, part: ["c_id"], ds: IndexDS.BTREE, ops: new KeyOptions()
    }}
  ]
  test_case_npk.forEach(t_case => {
    const type = fetchKeyType(t_case.input);
    expect(type).toBe(t_case.expect.type);
    expect(fetchKeyName(t_case.input, type!)).toBe(t_case.expect.name);
    expect(fetchKeyPart(t_case.input)).toEqual(t_case.expect.part);
    expect(unmarshalKeyOptions(t_case.input)).toEqual(t_case.expect.ops);
  })

  let test_case_pk = [
    {input: "  PRIMARY KEY (`id`),", expect: {
      type: KeyType.PRIMARY_KEY, part: ["id"], ds: IndexDS.BTREE, ops: new KeyOptions()
    }}
  ]
  test_case_pk.forEach(t_case => {
    const type = fetchKeyType(t_case.input);
    expect(type).toBe(t_case.expect.type);
    expect(fetchKeyPart(t_case.input)).toEqual(t_case.expect.part);
    expect(unmarshalKeyOptions(t_case.input)).toEqual(t_case.expect.ops);
  })
})


test('compare Key', () => {
  let input_1 = "CREATE TABLE `tbl_a` (\n\
    `id` int NOT NULL AUTO_INCREMENT,\n\
    `c_id` int NOT NULL COMMENT 'c_id',\n\
    `name` varchar(62) NOT NULL DEFAULT '',\n\
    `d_id` int NOT NULL,\n\
    PRIMARY KEY (`id`),\n\
    UNIQUE KEY `name` (`name`),\n\
    UNIQUE KEY `nani` (`d_id`, `name`),\n\
    KEY `c_id` (`c_id`,`d_id`),\n\
    KEY `test_index_ibfk_2` (`d_id`)\n\
  );";
  let input_2 = "CREATE TABLE `tbl_b` (\n\
    `c_id` int NOT NULL AUTO_INCREMENT COMMENT 'c_id',\n\
    `id` int NOT NULL,\n\
    `name` varchar(62) NOT NULL DEFAULT '',\n\
    `d_id` int NOT NULL,\n\
    PRIMARY KEY (`c_id`),\n\
    KEY `uk_c_id_d_id` (`c_id`,`d_id`),\n\
    UNIQUE KEY `name` (`d_id`, `name`),\n\
    KEY `test_index_ibfk_1` (`id`)\n\
  );";

  let [tbl_a, ] = processTable(splitSQL(input_1));
  let [tbl_b, ] = processTable(splitSQL(input_2));
  let diffs = tbl_a.keys.compareTo(tbl_b.keys);
  let ddl = tbl_a.keys.transform(diffs);
  console.log(ddl);
})
