import { BaseConstraint, CheckConstraint, FkConstraintOnStatement, ForeignKeyConstraint } from "@/model/Constraint";
import { DataColumn, DataColumnOptions } from "@/model/DataColumn";
import { NormalKey, PrimaryKey, UniqueKey, KeyOptions, BaseKey } from "@/model/Key";
import { Table } from "@/model/Table";
import { ConstraintType, IndexDS, KeyType } from "@/model/Enum";

import { fetchTableName } from "@/util/Table";
import { fetchKeyType, fetchKeyName, fetchKeyPart, unmarshalKeyOptions } from "@/util/Key";
import { fetchConstraintConditions, fetchConstraintName, fetchConstraintType, fetchFkConstraintCols, fetchFkConstraintOn, fetchFkConstraintRefTblCols, fetchFkConstraintRefTblName } from "@/util/Constraint";
import { removeArmor } from "@/util/Common";
import { fetchDataColumnName, fetchDataColumnOptions, fetchDataColumnType } from "@/util/DataColumn";
import { DDL } from "@/model/DDL";

export function processDDL(ddl: Array<String>): DDL {
  let tables: Array<Table> = [];

  for (let index = 0; index < ddl.length; index++) {
    const line = ddl[index];
    if (line.trimLeft().startsWith("--")) {
      continue;
    }

    if (line.trimLeft().startsWith("CREATE TABLE")) {
      let table: Table;
      [table, index] = processTable(ddl, index);
      tables.push(table);
      continue;
    }
  }
  return new DDL(tables);
}

export function processTable(table_ddl: Array<String>, start: number = 0): [Table, number] {
  let table_name: String = "";
  let columns: Array<DataColumn> = [];
  let keys: Array<BaseKey> = [];
  let constraints: Array<BaseConstraint> = [];

  let index: number = start;
  for (; index < table_ddl.length; index++) {
    const line = table_ddl[index];
    if (line.trimLeft().startsWith(")") && line.trimRight().endsWith(";")) {
      break;
    }

    // about comments
    if (line.trimLeft().startsWith("--")) {
      continue;
    }

    // about table name
    const create_table_pos = line.toUpperCase().indexOf("CREATE TABLE");
    if (create_table_pos >= 0) {
      table_name = fetchTableName(line);
      continue;
    }

    // about constraint
    const constraint_type = fetchConstraintType(line);
    if (constraint_type != null) {
      constraints.push(processConstraint(line, constraint_type) as BaseConstraint);
      continue;
    }

    // about key type
    const key_type = fetchKeyType(line);
    if (key_type != null) {
      keys.push(processKey(line, key_type) as BaseKey);
      continue;
    }

    // about data column
    columns.push(processDataColumn(line));
  }
  return [new Table(table_name, columns, keys, constraints), index];
}


function processKey(ddl: String, key_type: KeyType | null): BaseKey | null {
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
      return null;
  }
}


function processConstraint(ddl: String, constraint_type: ConstraintType): BaseConstraint | null {
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
      return null;
  }
}


function processDataColumn(ddl: String): DataColumn {
  let words: Array<String> = ddl.trimLeft().split(" ");
  const data_col_name = fetchDataColumnName(words[0]);
  const data_col_type = fetchDataColumnType(words);
  const data_col_options = fetchDataColumnOptions(words);
  return new DataColumn(data_col_name, data_col_type, data_col_options);
}
