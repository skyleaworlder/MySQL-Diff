import { DataColumn } from "@/model/DataColumn";
import { BaseConstraint } from "@/model/Constraint";
import { BaseKey } from "@/model/Key";

export class Table {

  table_name: String;

  columns: Array<DataColumn>;
  keys: Array<BaseKey>;
  constraints: Array<BaseConstraint>;

  constructor(table_name: String, columns: Array<DataColumn>, keys: Array<BaseKey>, constraints: Array<BaseConstraint>) {
    this.table_name = table_name;
    this.columns = columns;
    this.keys = keys;
    this.constraints = constraints;
  }
}
