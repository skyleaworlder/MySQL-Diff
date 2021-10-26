import { DataColumn } from "@/model/DataColumn";
import { Reference } from "@/model/Reference";
import { BaseKey } from "@/model/Key";

export class Table {
    columns: Array<DataColumn>;
    keys: Array<BaseKey>;
    reference: Reference;

    constructor(
        columns: Array<DataColumn>, keys: Array<BaseKey>,
        reference: Reference
    ) {
        this.columns = columns;
        this.keys = keys;
        this.reference = reference;
    }
}