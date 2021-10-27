import { DataColumn } from "@/model/DataColumn";
import { BaseConstraint } from "@/model/Constraint";
import { BaseKey } from "@/model/Key";

export class Table {
    columns: Array<DataColumn>;
    keys: Array<BaseKey>;
    constraints: Array<BaseConstraint>;

    constructor(columns: Array<DataColumn>, keys: Array<BaseKey>, constraints: Array<BaseConstraint>) {
        this.columns = columns;
        this.keys = keys;
        this.constraints = constraints;
    }
}
