import { StorageType } from "@/model/Enum";
import { Appender } from "./Common";

export class DataColumns implements Appender<DataColumn> {
  data_columns: Map<String, DataColumn>;

  constructor() {
    this.data_columns = new Map<String, DataColumn>();
  }

  /**
   * append
   * @param elem
   */
  public append(elem: DataColumn): void {
    this.data_columns.set(elem.col_name, elem);
  }
}


export class DataColumn {
  col_name: String;
  col_data_type: String;

  col_options: DataColumnOptions;

  constructor(col_name: String, col_data_type: String, col_options: DataColumnOptions) {
    this.col_name = col_name;
    this.col_data_type = col_data_type;
    this.col_options = col_options;
  }
}


export class DataColumnOptions {
  not_null: Boolean;
  default_val: any;
  visible: Boolean;
  auto_increment: Boolean;
  comment: String;
  collate: String;
  storage: String;

  constructor(
    not_null: Boolean = false, default_val: any = null, visible: Boolean = true,
    auto_increment: Boolean = false, comment: String = "", collate: String = "",
    storage = StorageType.EMPTY
  ) {
    this.not_null = not_null;
    this.default_val = default_val;
    this.visible = visible;
    this.auto_increment = auto_increment;
    this.comment = comment;
    this.collate = collate;
    this.storage = storage;
  }
}
