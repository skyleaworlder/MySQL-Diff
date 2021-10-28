import { IndexDS, KeyType } from "@/model/Enum";
import { KeyOptions } from "@/model/Key";
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
