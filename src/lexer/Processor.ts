import { BaseConstraint, CheckConstraint, FkConstraintOnStatement, ForeignKeyConstraint } from "@/model/Constraint";
import { DataColumn, DataColumnOptions } from "@/model/DataColumn";
import { NormalKey, PrimaryKey, UniqueKey, KeyOptions, BaseKey } from "@/model/Key";
import { Table } from "@/model/Table";
import { ConstraintType, IndexDS, KeyType } from "@/model/Enum";

import { fetchTableName } from "@/util/Table";
import { fetchKeyType, fetchKeyName, fetchKeyPart, unmarshalKeyOptions } from "@/util/Key";
import { fetchConstraintConditions, fetchConstraintName, fetchConstraintType, fetchFkConstraintCols, fetchFkConstraintOn, fetchFkConstraintRefTblCols, fetchFkConstraintRefTblName } from "@/util/Constraint";

export function processTable(table_ddl: Array<String>): Table {
  let table_name: String = "";
  let columns: Array<DataColumn> = [];
  let keys: Array<BaseKey> = [];
  let constraints: Array<BaseConstraint> = [];

  for (let index = 0; index < table_ddl.length; index++) {
    const line = table_ddl[index];

    // about table name
    const create_table_pos = line.toUpperCase().indexOf("CREATE TABLE")
    if (create_table_pos > 0) {
      table_name = fetchTableName(line);
      continue;
    }

    // about key type
    const key_type = fetchKeyType(line);
    if (key_type != null) {
      keys.push(processKey(line, key_type));
      continue;
    }

    // about constraint
    const constraint_type = fetchConstraintType(line);
    if (constraint_type != null) {
      constraints.push(processConstraint(line, constraint_type));
      continue;
    }

    // TODO: data column
  }
  return new Table(table_name, [], [], []);
}

function processKey(ddl: String, key_type: KeyType | null): BaseKey {
  let key_name: String;
  let key_part: Array<String> = fetchKeyPart(ddl);
  let key_options: KeyOptions = unmarshalKeyOptions(ddl);
  switch (key_type) {
    case KeyType.PRIMARY_KEY:
      return new PrimaryKey(key_part, IndexDS.BTREE, key_options);
    case KeyType.UNIQUE_KEY:
      key_name = fetchKeyName(ddl, key_type);
      return new UniqueKey(key_name, key_part, IndexDS.BTREE, key_options);
    case KeyType.NORMAL_KEY:
      key_name = fetchKeyName(ddl, key_type);
      return new NormalKey(key_name, key_part, IndexDS.BTREE, key_options);
    default:
      console.error("processKey error: unknown key type!");
      return new BaseKey(KeyType.NORMAL_KEY, [], undefined, new KeyOptions());
  }
}

function processConstraint(ddl: String, constraint_type: ConstraintType): BaseConstraint {
  let constraint_name: String = fetchConstraintName(ddl);
  switch (constraint_type) {
    case ConstraintType.CHECK_CONSTRAINT:
      let constraint_conditions: String = fetchConstraintConditions(ddl);
      return new CheckConstraint(constraint_name, constraint_conditions);
    case ConstraintType.FOREIGN_KEY_CONSTRAINT:
      let fk_constraint_cols: Array<String> = fetchFkConstraintCols(ddl);
      let fk_constraint_refer_tbl: String = fetchFkConstraintRefTblName(ddl);
      let fk_constraint_refer_cols: Array<String> = fetchFkConstraintRefTblCols(ddl);
      let fk_constraint_on: Array<FkConstraintOnStatement> = fetchFkConstraintOn(ddl);
      return new ForeignKeyConstraint(
        constraint_name, fk_constraint_cols, fk_constraint_refer_tbl,
        fk_constraint_refer_cols, fk_constraint_on
      );
    default:
      console.error("processConstraint error: unknown constraint type!");
      return new BaseConstraint("", ConstraintType.CHECK_CONSTRAINT);
  }
}
