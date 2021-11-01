import { DataColumn, DataColumns } from "@/model/DataColumn";
import { BaseConstraint, Constraints } from "@/model/Constraint";
import { BaseKey, Keys } from "@/model/Key";
import { Comparer, Transformer, TableElement } from "@/model/Common";
import { Difference } from "@/model/Difference";
import { DifferenceType } from "@/model/Enum";

export class Table implements Comparer<Table, TableElement>, Transformer<TableElement> {
  table_name: String;

  columns: DataColumns;
  keys: Keys;
  constraints: Constraints;

  constructor(table_name: String, columns: Array<DataColumn>, keys: Array<BaseKey>, constraints: Array<BaseConstraint>) {
    this.table_name = table_name;
    this.columns = new DataColumns(table_name);
    this.keys = new Keys(table_name);
    this.constraints = new Constraints(table_name);
    columns.forEach(col => { this.columns.append(col) });
    keys.forEach(key => { this.keys.append(key) });
    constraints.forEach(con => { this.constraints.append(con) });
  }

  public compareTo(that: Table): Array<Difference<TableElement>> {
    let res: Array<Difference<TableElement>> = [];
    this.columns.compareTo(that.columns).forEach(diff => res.push(diff));
    this.keys.compareTo(that.keys).forEach(diff => res.push(diff));
    this.constraints.compareTo(that.constraints).forEach(diff => res.push(diff));
    return res;
  }

  public transform(differences: Array<Difference<TableElement>>): Array<String> {
    let trans_ddl: Array<String> = [];
    let col_diff: Array<Difference<DataColumn>> = [];
    let key_diff: Array<Difference<BaseKey>> = [];
    let con_diff: Array<Difference<BaseConstraint>> = [];
    differences.forEach(diff => {
      switch (diff.type) {
        case DifferenceType.COL_ADD:
        case DifferenceType.COL_DROP:
        case DifferenceType.COL_MODIFY:
          col_diff.push(diff as Difference<DataColumn>);
          break;
        case DifferenceType.KEY_ADD:
        case DifferenceType.KEY_DROP:
        case DifferenceType.KEY_MODIFY:
        case DifferenceType.KEY_RENAME:
        case DifferenceType.PK_MODIFY:
          key_diff.push(diff as Difference<BaseKey>);
          break;
        case DifferenceType.CON_ADD:
        case DifferenceType.CON_DROP:
        case DifferenceType.CON_MODIFY:
          con_diff.push(diff as Difference<BaseConstraint>);
          break;
      }
    });
    this.columns.transform(col_diff).forEach(ddl => trans_ddl.push(ddl));
    this.keys.transform(key_diff).forEach(ddl => trans_ddl.push(ddl));
    this.constraints.transform(con_diff).forEach(ddl => trans_ddl.push(ddl));
    return trans_ddl;
  }
}
