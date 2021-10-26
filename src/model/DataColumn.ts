import { CheckConstraint } from "@/model/CheckConstraint";
import { Reference } from "@/model/Reference";

export class DataColumn {
    col_name: String;
    col_data_type: String;

    col_options: DataColumnOptions;

    constructor(
        col_name: String, col_data_type: String,
        col_options: DataColumnOptions
    ) {
        this.col_name = col_name;
        this.col_data_type = col_data_type;
        this.col_options = col_options;
    }
};


export class DataColumnOptions {
    not_null: Boolean;
    default_val: any;
    visible: Boolean;
    auto_increment: Boolean;
    comment: String;
    collate: String;
    storage: String;

    unique_key: Boolean;
    primary_key: Boolean;

    constraint: CheckConstraint;
    reference: Reference;

    constructor(
        not_null: Boolean, default_val: any,
        visible: Boolean, auto_increment: Boolean,
        comment: String, collate: String,
        storage: String,

        unique_key: Boolean, primary_key: Boolean,
        constraint: CheckConstraint,
        reference: Reference
    ) {
        this.not_null = not_null;
        this.default_val = default_val;
        this.visible = visible;
        this.auto_increment = auto_increment;
        this.comment = comment;
        this.collate = collate;
        this.storage = storage;

        this.unique_key = unique_key;
        this.primary_key = primary_key;

        this.constraint = constraint;
        this.reference = reference;
    }
};