import { fetchFkConstraintOn } from "@/util/Constraint";

test('fetch foreign key constraint on statement', () => {
  let res: Array<String>;
  let test_case = [
    //{input: "CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE", expect: ["test_index_ibfk_1", "c_id", "test_constraint", "id"]},
    {input: "CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE ON UPDATE SET DEFAULT", expect: null}
  ]
  test_case.forEach(t_case => {
    console.log(fetchFkConstraintOn(t_case.input));
  })
})
