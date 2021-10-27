import { FkConstraintOnStatement } from "@/model/Constraint";
import { ConstraintType, ReferenceAction, ReferenceOption } from "@/model/Enum";
import { getItems, getStrSurroundWith, getStrSurroundWithBracket, includeCap } from "@/util/Common";

/**
 * fetchConstraintType 获取约束的 Type
 * @param ddl 是定义约束的那一行
 * @returns 约束的类型
 */
export function fetchConstraintType(ddl: String): ConstraintType | null {
  const ddl_upper_case = ddl.toUpperCase();
  if (ddl_upper_case.includes(ConstraintType.FOREIGN_KEY_CONSTRAINT)) {
    return ConstraintType.FOREIGN_KEY_CONSTRAINT;
  } else if (ddl_upper_case.includes(ConstraintType.CHECK_CONSTRAINT)) {
    return ConstraintType.CHECK_CONSTRAINT;
  } else {
    return null;
  }
}


/**
 * fetchConstraintName 获取约束的 Name
 * @param ddl 是定义约束的那一行
 * @returns 约束的 Name
 */
export function fetchConstraintName(ddl: String): String {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchConstraintName error: this ddl is not going to define a constraint.");
    return "";
  }
  let [name, beg, end, out_of_bound] = getStrSurroundWith(ddl, "`", 0);
  if (beg < 0 || end < 0 || out_of_bound) {
    console.error("fetchConstraintName error: constraint do not have a name, error!!!");
    return "";
  }
  return name;
}


/**
 * fetchConstraintConditions 获得 Check-Constraint 的约束条件
 * @param ddl 是定义约束的那一行
 * @returns 约束条件
 */
export function fetchConstraintConditions(ddl: String): String {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchConstraintConditions error: this ddl is not going to define a constraint.");
    return "";
  }
  if (!isConstraintCheckExist(ddl)) {
    console.error("fetchConstraintConditions error: check-constraint do not have a check, error!!!");
    return "";
  }

  let l1_bracket_pos: number = ddl.indexOf("(");
  let r1_bracket_pos: number = ddl.lastIndexOf(")");
  if (l1_bracket_pos < 0 || r1_bracket_pos < 0) {
    console.error("fetchConstraintConditions error: constraint do not have a name, error!!!")
    return "";
  }
  return ddl.slice(l1_bracket_pos, r1_bracket_pos + 1);
}


/**
 * fetchFkConstraintCols
 * @param ddl 是定义约束的那一行
 * @returns 约束的 columns
 */
export function fetchFkConstraintCols(ddl: String): Array<String> {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchFkConstraintCols error: this ddl is not going to define a constraint.");
    return [];
  }
  if (!isConstraintForeignKeyExist(ddl)) {
    console.error("fetchFkConstraintCols error: foreign-key-constraint do not have foreign key, error!!!");
    return [];
  }
  const [content, lbracket_pos, rbracket_pos, out_of_bound] = getStrSurroundWithBracket(
    ddl, ddl.toUpperCase().indexOf("FOREIGN KEY")
  );
  if (lbracket_pos < 0 || rbracket_pos < 0 || out_of_bound) {
    console.error("fetchFkConstraintCols error: foreign key column bracket not paired, error!!!");
    return [];
  }
  return getItems(content);
}


/**
 * fetchFkConstraintRefTblName 返回约束中 ref 的表的名字
 * @param ddl 是定义约束的那一行
 * @returns Ref 表的名字
 */
export function fetchFkConstraintRefTblName(ddl: String): String {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchFkConstraintRefTblName error: this ddl is not going to define a constraint.");
    return "";
  }
  if (!isConstraintReferencesExist(ddl)) {
    console.error("fetchFkConstraintRefTblName error: foreign-key-constraint do not have references part, error!!!");
    return "";
  }
  let [res, beg, end, out_of_bound] = getStrSurroundWith(
    ddl, "`", ddl.indexOf("REFERENCES")
  );
  if (beg < 0 || end < 0 || out_of_bound) {
    console.error("fetchFkConstraintRefTblName error: references part \"`\" not paired, error!!!");
    return "";
  }
  return res;
}


/**
 * fetchFkConstraintRefTblCols 返回约束中 Ref 的表中相关的 column
 * @param ddl 是定义约束的哪一行
 * @returns Ref 表中的 columns
 */
export function fetchFkConstraintRefTblCols(ddl: String): Array<String> {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchFkConstraintRefTblCols error: this ddl is not going to define a constraint.");
    return [];
  }
  if (!isConstraintReferencesExist(ddl)) {
    console.error("fetchFkConstraintRefTblCols error: foreign-key-constraint do not have references part, error!!!");
    return [];
  }
  const [content, lbracket_pos, rbracket_pos, out_of_bound] = getStrSurroundWithBracket(
    ddl, ddl.toUpperCase().indexOf("REFERENCES")
  );
  if (lbracket_pos < 0 || rbracket_pos < 0 || out_of_bound) {
    console.error("fetchFkConstraintRefTblCols error: foreign key column bracket not paired, error!!!");
    return [];
  }
  return getItems(content);
}


/**
 * fetchFkConstraintOn 返回 Foreign-Key Constraint 中 ON 相关的条件和动作
 * @param ddl 是要定义约束的那一行
 * @returns 约束触发条件和动作
 */
export function fetchFkConstraintOn(ddl: String): Array<FkConstraintOnStatement> {
  if (!isConstraintDefinition(ddl)) {
    console.error("fetchFkConstraintOn error: this ddl is not going to define a constraint.");
    return [];
  }
  if (!isConstraintOnExist(ddl)) {
    return [];
  }

  let fk_constraint_on: Array<FkConstraintOnStatement> = [];
  let on_pos: number;
  // 因为 ON DELETE 和 ON UPDATE 可能同时出现
  do {
    let fk_constraint_action: ReferenceAction;
    let fk_constraint_option: ReferenceOption;
    const ddl_upper_case = ddl.toUpperCase();
    on_pos = ddl_upper_case.indexOf("ON ")
    const action: String = ddl_upper_case.slice(on_pos + 3, on_pos + 9);
    if (action == "DELETE") {
      fk_constraint_action = ReferenceAction.DELETE;
    } else if (action == "UPDATE") {
      fk_constraint_action = ReferenceAction.UPDATE;
    } else {
      console.error("fetchFkConstraintOn error: do not support other action, but DELETE and UPDATE, error!!!");
      break;
    }
    // 跳过 action 匹配 option
    let opt_beg_pos: number = ddl_upper_case.indexOf(fk_constraint_action) + fk_constraint_action.length;
    let opt_end_pos = ddl_upper_case.indexOf("ON ", opt_beg_pos);
    opt_end_pos = (opt_end_pos < 0) ? ddl_upper_case.length : opt_end_pos;
    const option: String = ddl_upper_case.slice(opt_beg_pos, opt_end_pos);
    if (option.includes(ReferenceOption.CASCADE)) {
      fk_constraint_option = ReferenceOption.CASCADE;
    } else if (option.includes(ReferenceOption.RESTRICT)) {
      fk_constraint_option = ReferenceOption.RESTRICT;
    } else if (option.includes(ReferenceOption.SET_NULL)) {
      fk_constraint_option = ReferenceOption.SET_NULL;
    } else if (option.includes(ReferenceOption.NO_ACTION)) {
      fk_constraint_option = ReferenceOption.NO_ACTION;
    } else if (option.includes(ReferenceOption.SET_DEFAULT)) {
      fk_constraint_option = ReferenceOption.SET_DEFAULT;
    } else {
      console.error("fetchFkConstraintOn error: on-action has no reference option, error!!!");
      return [];
    }
    fk_constraint_on.push(new FkConstraintOnStatement(fk_constraint_action, fk_constraint_option));

    // 迭代 ddl，往后移动，移到下一个 ON 的位置。
    // 如果没有下一个 ON，ddl 就变成了空字符串。
    ddl = ddl.slice(opt_end_pos, ddl.length);
  } while (ddl.length > 0);
  return fk_constraint_on;
}


function isConstraintDefinition(ddl: String): boolean {
  return includeCap(ddl, "CONSTRAINT");
}

function isConstraintCheckExist(ddl: String): boolean {
  return includeCap(ddl, "CHECK");
}

function isConstraintForeignKeyExist(ddl: String): boolean {
  return includeCap(ddl, "FOREIGN KEY");
}

function isConstraintReferencesExist(ddl: String): boolean {
  return includeCap(ddl, "REFERENCES");
}

function isConstraintOnExist(ddl: String): boolean {
  return includeCap(ddl, "ON");
}
