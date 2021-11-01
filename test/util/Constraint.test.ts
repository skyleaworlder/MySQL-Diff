import { processTable } from "@/lexer/Processor";
import { ConstraintType } from "@/model/Enum";
import { splitSQL } from "@/util/Common";
import { fetchConstraintConditions, fetchConstraintName, fetchConstraintType, fetchFkConstraintCols, fetchFkConstraintOn, fetchFkConstraintRefTblCols, fetchFkConstraintRefTblName } from "@/util/Constraint";

test('fetch constraint', () => {
  let test_case_fk = [
    {input: "CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE ON UPDATE SET DEFAULT", expect: {
      type: ConstraintType.FOREIGN_KEY_CONSTRAINT,
      name: "test_index_ibfk_1",
      cols: ["c_id"],
      reftbl: "test_constraint",
      refcols: ["id"]
    }},
  ]
  test_case_fk.forEach(t_case => {
    let type = fetchConstraintType(t_case.input);
    expect(type).toBe(t_case.expect.type);
    let name = fetchConstraintName(t_case.input);
    expect(name).toBe(t_case.expect.name);
    let cols = fetchFkConstraintCols(t_case.input);
    expect(cols).toEqual(t_case.expect.cols);
    let reftbl = fetchFkConstraintRefTblName(t_case.input);
    expect(reftbl).toBe(t_case.expect.reftbl);
    let refcols = fetchFkConstraintRefTblCols(t_case.input);
    expect(refcols).toEqual(t_case.expect.refcols);
  })
  let test_case_ck = [
    {input: "  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),", expect: {
      type: ConstraintType.CHECK_CONSTRAINT,
      name: "c1_nonzero",
      cond: "((`c1` <> 0))"
    }},
    {input: "  CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),", expect: {
      type: ConstraintType.CHECK_CONSTRAINT,
      name: "test_constraint_chk_3",
      cond: "((`c1` <> `c2`))"
    }}
  ]
  test_case_ck.forEach(t_case => {
    let type = fetchConstraintType(t_case.input);
    expect(type).toBe(t_case.expect.type);
    let name = fetchConstraintName(t_case.input);
    expect(name).toBe(t_case.expect.name);
    let cond = fetchConstraintConditions(t_case.input);
    expect(cond).toEqual(t_case.expect.cond);
  })
})


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


test('compare constraint', () => {
  let input_1 = "CREATE TABLE `tbl_a` (\n\
    `c1` int DEFAULT NULL,\n\
    `c2` int DEFAULT NULL,\n\
    `c3` int DEFAULT NULL,\n\
    `c_id` int NOT NULL COMMENT 'c_id',\n\
    `d_id` int NOT NULL,\n\
    CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),\n\
    CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),\n\
    CONSTRAINT `test_constraint_chk_4` CHECK ((`c1` > `c3`)),\n\
    CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`, `d_id`) REFERENCES `test_datacolumn` (`c_id`, `id`) ON DELETE CASCADE\n\
  );";
  let input_2 = "CREATE TABLE `test_constraint` (\n\
    `c1` int DEFAULT NULL,\n\
    `c2` int DEFAULT NULL,\n\
    `c3` int DEFAULT NULL,\n\
    `c_id` int NOT NULL COMMENT 'c_id',\n\
    `d_id` int NOT NULL,\n\
    CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),\n\
    CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),\n\
    CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `id`)),\n\
    CONSTRAINT `test_constraint_chk_5` CHECK ((`c1` > `c3`)),\n\
    CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_datacolumn` (`c_id`) ON DELETE CASCADE,\n\
    CONSTRAINT `test_index_ibfk_2` FOREIGN KEY (`d_id`) REFERENCES `test_datacolumn` (`id`) ON DELETE CASCADE\n\
  );";

  let [tbl_a, ] = processTable(splitSQL(input_1));
  let [tbl_b, ] = processTable(splitSQL(input_2));
  let diffs = tbl_a.constraints.compareTo(tbl_b.constraints);
  let ddl = tbl_a.constraints.transform(diffs);
  console.log(ddl);
})
