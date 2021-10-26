
export class Reference {
    table_name: String;
    on_action: String;  // delete or update.
    key_part: Array<String>;

    constructor(
        table_name: String, on_action: String,
        key_part: Array<String>
    ) {
        this.table_name = table_name;
        this.on_action = on_action;
        this.key_part = key_part;
    }
}