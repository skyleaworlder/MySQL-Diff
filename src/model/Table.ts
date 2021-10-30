import { DataColumn, DataColumns } from "@/model/DataColumn";
import { BaseConstraint, Constraints } from "@/model/Constraint";
import { BaseKey, Keys } from "@/model/Key";

export class Table {
  table_name: String;

  columns: DataColumns;
  keys: Keys;
  constraints: Constraints;

  constructor(table_name: String, columns: Array<DataColumn>, keys: Array<BaseKey>, constraints: Array<BaseConstraint>) {
    this.table_name = table_name;
    this.columns = new DataColumns();
    this.keys = new Keys();
    this.constraints = new Constraints();
    columns.forEach(col => { this.columns.append(col) });
    keys.forEach(key => { this.keys.append(key) });
    constraints.forEach(con => { this.constraints.append(con) });
  }
}
