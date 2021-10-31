import { Table } from "@/model/Table";

export class DDL {
    tables: Array<Table>

    constructor(tables: Array<Table>) {
        this.tables = tables;
    }
}
