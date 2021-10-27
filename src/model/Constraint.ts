import { ConstraintType, ReferenceAction, ReferenceOption } from "@/model/Enum";

/**
 * BaseConstraint 基类。
 * 并不直接使用。
 */
export class BaseConstraint {
    constraint_name: String;
    constraint_type: ConstraintType;

    constructor(constraint_name: String, constraint_type: ConstraintType) {
        this.constraint_type = constraint_type;
        this.constraint_name = constraint_name;
    }
}


/**
 * CheckConstraint 是 Constraint 的一种。
 * 按道理说需要跟多个 condition，但是多个 condition 可以整合在一起。
 * 同时，MySQL 在 show create table 时会自动分离不同 data column 的 check。
 * @param constraint_name 约束名
 * @param chk_constraint_conditions 约束条件
 */
export class CheckConstraint extends BaseConstraint {
    chk_constraint_conditions: String;

    constructor(constraint_name: String, chk_constraint_conditions: String) {
        super(constraint_name, ConstraintType.CHECK_CONSTRAINT);
        this.chk_constraint_conditions = chk_constraint_conditions;
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
export class ForeignKeyConstraint extends BaseConstraint {
    fk_constraint_cols: Array<String>;
    fk_constraint_refer_tbl: String;
    fk_constraint_refer_cols: Array<String>;
    fk_constraint_action: String;
    fk_constraint_option: String;

    constructor(
        constraint_name: String, fk_constraint_cols: Array<String>,
        fk_constraint_refer_tbl: String, fk_constraint_refer_cols: Array<String>,
        fk_constraint_action = ReferenceAction.EMPTY, fk_constraint_option = ReferenceOption.EMPTY
    ) {
        super(constraint_name, ConstraintType.FOREIGN_KEY_CONSTRAINT);
        this.fk_constraint_cols = fk_constraint_cols;
        this.fk_constraint_refer_tbl = fk_constraint_refer_tbl;
        this.fk_constraint_refer_cols = fk_constraint_refer_cols;
        this.fk_constraint_action = fk_constraint_action;
        this.fk_constraint_option = fk_constraint_option;
    }
}