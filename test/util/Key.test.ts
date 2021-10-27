import { fetchKeyPart } from "@/util/Key";

test('get key part from ddl', () => {
  let key_part: Array<String>;
  // UNIQUE KEY
  key_part = fetchKeyPart("  UNIQUE KEY `name` (`name`, `c_id`),");
  expect(key_part).toEqual(["name", "c_id"]);
  // KEY
  key_part = fetchKeyPart("KEY `c_id` (`c_id`),");
  expect(key_part).toEqual(["c_id"]);
  // PRIMARY KEY
  key_part = fetchKeyPart("  PRIMARY KEY (`id`),");
  expect(key_part).toEqual(["id"]);
})
