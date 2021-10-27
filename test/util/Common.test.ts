import { getItems, getStrSurroundWith } from "@/util/Common";

test("fetch the first name from ddl sentence", () => {
  let res: String, beg: number, end: number, out_of_bound: boolean;

  // normal fetch str
  [res, beg, end, out_of_bound] = getStrSurroundWith(
    "   CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),", "`", 0
  );
  expect(res).toBe("c1_nonzero");

  // normal end
  let test_case: any[] = [
    {expect: "name"},
    {expect: "name"},
    {expect: "c_id"},
    {expect: ""},
  ];
  end = -1;
  test_case.forEach(t_case => {
    [res, beg, end, out_of_bound] = getStrSurroundWith(
      "  UNIQUE KEY `name` (`name`, `c_id`),", "`", end+1
    );
    expect(res).toBe(t_case.expect);
  });

  // ` not paired
  [res, beg, end, out_of_bound] = getStrSurroundWith(
    "  UNIQUE KEY `name (name, c_id),", "`", 0
  );
  expect(res).toBe("");
})

test("getItems", () => {
  let res: Array<String>;
  let test_case = [
    {input: "UNIQUE KEY (`c_id`, `k_id`)", expect: ["c_id", "k_id"]},
    {input: "UNIQUE KEY (`c_id`, `k_id)", expect: ["c_id"]},
    {input: "CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE", expect: ["test_index_ibfk_1", "c_id", "test_constraint", "id"]}
  ]
  test_case.forEach(t_case => {
    res = getItems(t_case.input);
    expect(res).toEqual(t_case.expect);
  })
})
