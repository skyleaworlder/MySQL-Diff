import { BaseConstraint, CheckConstraint, ForeignKeyConstraint } from "@/model/Constraint";
import { DataColumn, DataColumnOptions } from "@/model/DataColumn";
import { NormalKey, PrimaryKey, UniqueKey, KeyOptions, BaseKey } from "@/model/Key";
import { Table } from "@/model/Table";
import { KeyType } from "@/model/Enum";

import { fetchTableName } from "@/util/Table";
import { fetchKeyType, fetchKeyName } from "@/util/Key";

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
  }
  return new Table(table_name, [], [], []);
}

function processKey(ddl: String): BaseKey {
  let key_type: KeyType = fetchKeyType(ddl);
  return new BaseKey();
}
