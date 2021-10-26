import { Reference } from "@/model/Reference";

export class BaseKey {
    key_type: String;
    key_name: String;
    key_part: Array<String>;

    constructor(
        key_type: String, key_name: String,
        key_part: Array<String>
    ) {
        this.key_type = key_type;
        this.key_name = key_name;
        this.key_part = key_part;
    }
}


export class ForeignKey extends BaseKey {

    reference: Reference;

    constructor(
        key_name: String, key_part: Array<String>,
        reference: Reference
    ) {
        // here, key_part is from another table.
        super("FOREIGN KEY", key_name, key_part);
        this.reference = reference;
    }
}


export class NotForeignKey extends BaseKey {

    is_btree: Boolean;

    constructor(
        key_type: String, key_name: String,
        key_part: Array<String>, is_btree: Boolean
    ) {
        super(key_type, key_name, key_part);
        this.is_btree = is_btree;
    }
}


export class PrimaryKey extends NotForeignKey {
    constructor(
        key_name: String, key_part: Array<String>,
        is_btree: Boolean
    ) {
        super("PRIMARY KEY", key_name, key_part, is_btree);
    }
}


export class UniqueKey extends NotForeignKey {
    constructor(
        key_name: String, key_part: Array<String>,
        is_btree: Boolean
    ) {
        super("UNIQUE KEY", key_name, key_part, is_btree);
    }
}


export class NormalKey extends NotForeignKey {
    constructor(
        key_name: String, key_part: Array<String>,
        is_btree: Boolean
    ) {
        super("KEY", key_name, key_part, is_btree);
    }
}