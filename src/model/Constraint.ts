import { ConstraintType, DifferenceType, ReferenceAction, ReferenceOption } from "@/model/Enum";
import { Appender, Comparer, Equaler } from "@/model/Common";
import { Difference } from "@/model/Difference";
import { table } from "../../mysql-diff-settings.json";
import { equalArray } from "@/util/Common";

export class Constraints implements Appender<BaseConstraint>, Comparer<Constraints, BaseConstraint> {
  constraints: Map<String, BaseConstraint>;

  constructor() {
    this.constraints = new Map<String, BaseConstraint>();
  }

  /**
   * append
   * @param elem
   */
  public append(elem: BaseConstraint): void {
    this.constraints.set(elem.constraint_name, elem);
  }

  /**
   * compareTo
   * @param that 另一个 Constraints
   * @returns 两个 Constraints 的差异
   */
  public compareTo(that: Constraints): Array<Difference<BaseConstraint>> {
    let cons_have_diff: Array<Difference<BaseConstraint>> = [];
    let this_con_used: Array<String> = [];

    const that_cons = that.constraints;
    that_cons.forEach((that_con, con_name) => {
      if (this.constraints.has(con_name)) {
        // this(src) 中存在和 that(tar) 同名的 constraint
        this_con_used.push(con_name);
        const this_con = this.constraints.get(con_name);
        if ((this_con as BaseConstraint).equal(that_con)) {
          // this(src) 与 that(tar) 的该 constraint 完全一致，pass
          return;
        } else {
          // this(src) 与 that(tar) 的该 constraint 存在差异
          cons_have_diff.push(new Difference<BaseConstraint>(
            DifferenceType.CON_MODIFY, that_con, this_con as BaseConstraint
          ));
        }
      } else {
        // this(src) 中没有 that(tar) 中有的 constraint，this(src) 需要添加
        cons_have_diff.push(new Difference<BaseConstraint>(DifferenceType.CON_ADD, that_con, null))
      }
    })

    // 考虑 this 相较于 that 是否还有多余的约束
    this.constraints.forEach((this_con, con_name) => {
      if (this_con_used.indexOf(con_name) >= 0) {
        return;
      }
      cons_have_diff.push(new Difference<BaseConstraint>(
        DifferenceType.CON_DROP, null, this_con
      ))
    })
    return cons_have_diff;
  }
}


/**
 * BaseConstraint 基类。
 * 并不直接使用。
 */
export abstract class BaseConstraint implements Equaler<BaseConstraint> {
  constraint_name: String;
  constraint_type: ConstraintType;

  constructor(constraint_name: String, constraint_type: ConstraintType) {
    this.constraint_type = constraint_type;
    this.constraint_name = constraint_name;
  }

  public abstract equal(that: BaseConstraint): boolean;
}


/**
 * CheckConstraint 是 Constraint 的一种。
 * 按道理说需要跟多个 condition，但是多个 condition 可以整合在一起。
 * 同时，MySQL 在 show create table 时会自动分离不同 data column 的 check。
 * @param constraint_name 约束名
 * @param chk_constraint_conditions 约束条件
 */
export class CheckConstraint extends BaseConstraint implements Equaler<CheckConstraint> {
  chk_constraint_conditions: String;

  constructor(constraint_name: String, chk_constraint_conditions: String) {
    super(constraint_name, ConstraintType.CHECK_CONSTRAINT);
    this.chk_constraint_conditions = chk_constraint_conditions;
  }

  public equal(that: CheckConstraint): boolean {
    const settings = table.constraint;
    const ck_settings = table.constraint.check;
    return (
      (!settings.name || settings.name && (this.constraint_name == that.constraint_name))
      && (!settings.type || settings.type && (this.constraint_type == that.constraint_type))
      && (!ck_settings.conditions || ck_settings.conditions && (this.chk_constraint_conditions == this.chk_constraint_conditions))
    );
  }
}


/**
 * ForeignKeyConstraint 是 Constraint 的一种。
 * MySQL 会把 Foreign Key 写在 data column 之后，同时也会命名 Constraint Name。
 * @param constraint_name ForeignKeyConstraint 的约束名
 * @param fk_constraint_cols 对于本表来说，作为外键的 columns
 * @param fk_constraint_refer_tbl refer 的外表名
 * @param fk_constraint_refer_cols refer 的外表中的字段
 * @param fk_constraint_action 触发 ForeignKeyConstraint 的行为
 * @param fk_constraint_option
 */
export class ForeignKeyConstraint extends BaseConstraint implements Equaler<ForeignKeyConstraint> {
  fk_constraint_cols: Array<String>;
  fk_constraint_refer_tbl: String;
  fk_constraint_refer_cols: Array<String>;
  fk_constraint_on: Array<FkConstraintOnStatement>;

  constructor(
    constraint_name: String, fk_constraint_cols: Array<String>,
    fk_constraint_refer_tbl: String, fk_constraint_refer_cols: Array<String>,
    fk_constraint_on: Array<FkConstraintOnStatement>
  ) {
    super(constraint_name, ConstraintType.FOREIGN_KEY_CONSTRAINT);
    this.fk_constraint_cols = fk_constraint_cols;
    this.fk_constraint_refer_tbl = fk_constraint_refer_tbl;
    this.fk_constraint_refer_cols = fk_constraint_refer_cols;
    this.fk_constraint_on = fk_constraint_on;
  }

  public equal(that: ForeignKeyConstraint): boolean {
    const settings = table.constraint;
    const fk_settings = table.constraint.foreign_key;
    const fk_constraint_cols_equal: boolean = equalArray(this.fk_constraint_cols, that.fk_constraint_cols);
    const fk_constraint_ref_cols_equal: boolean = equalArray(this.fk_constraint_refer_cols, that.fk_constraint_refer_cols);
    const fk_constraint_on_equal: boolean = equalArray(this.fk_constraint_on, that.fk_constraint_on);
    return (
      (!settings.name || settings.name && (this.constraint_name == that.constraint_name))
      && (!settings.type || settings.type && (this.constraint_type == that.constraint_type))
      && (!fk_settings.columns || fk_settings.columns && fk_constraint_cols_equal)
      && (!fk_settings.refer_table || fk_settings.refer_table && (this.fk_constraint_refer_tbl == that.fk_constraint_refer_tbl))
      && (!fk_settings.refer_table_columns || fk_settings.refer_table_columns && fk_constraint_ref_cols_equal)
      && (!fk_settings.on || fk_settings.on && fk_constraint_on_equal)
    );
  }
}


export class FkConstraintOnStatement implements Equaler<FkConstraintOnStatement> {
  fk_constraint_action: ReferenceAction;
  fk_constraint_option: ReferenceOption;

  constructor(fk_constraint_action = ReferenceAction.EMPTY, fk_constraint_option = ReferenceOption.EMPTY) {
    this.fk_constraint_action = fk_constraint_action;
    this.fk_constraint_option = fk_constraint_option;
  }

  public equal(that: FkConstraintOnStatement): boolean {
    const settings = table.constraint.foreign_key.on;
    return (
      (!settings.action || settings.action && (this.fk_constraint_action == that.fk_constraint_action))
      && (!settings.option || settings.option && (this.fk_constraint_option == that.fk_constraint_option))
    );
  }
}
