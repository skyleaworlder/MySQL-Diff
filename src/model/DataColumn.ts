import { DifferenceType, StorageType } from "@/model/Enum";
import { Appender, Comparer, Equaler, Serializer, Transformer, TableContext, TableElement } from "@/model/Common";
import { Difference } from "@/model/Difference";
import { table } from "../../mysql-diff-settings.json";

export class DataColumns extends TableContext implements Appender<DataColumn>, Comparer<DataColumns, DataColumn>, Transformer<DataColumn> {
  data_columns: Map<String, DataColumn>;

  constructor(table_name: String) {
    super(table_name);
    this.data_columns = new Map<String, DataColumn>();
  }

  /**
   * append
   * @param elem
   */
  public append(elem: DataColumn): void {
    this.data_columns.set(elem.col_name, elem);
  }

  /**
   * compareTo implements interface Comparer
   * @param that 另一个 DataColumns
   * @returns 两个 DataColumns 的差异
   */
  public compareTo(that: DataColumns): Array<Difference<DataColumn>> {
    let cols_have_diff: Array<Difference<DataColumn>> = [];
    let this_col_used: Array<String> = [];

    const that_cols = that.data_columns;
    that_cols.forEach((that_col, col_name) => {
      if (this.data_columns.has(col_name)) {
        // this(src) 中存在和 that(tar) 同名 column
        this_col_used.push(col_name);
        const this_col = this.data_columns.get(col_name);
        if ((this_col as DataColumn).equal(that_col)) {
          // this(src) 与 that(tar) 的该 column 完全一致，pass
          return;
        } else {
          // this(src) 与 that(tar) 的该 column 存在差异
          cols_have_diff.push(new Difference<DataColumn>(
            DifferenceType.COL_MODIFY, that_col, this_col as DataColumn
          ));
        }
      } else {
        // this(src) 中没有 that(tar) 中有的 column，this(src) 需要添加
        cols_have_diff.push(new Difference<DataColumn>(
          DifferenceType.COL_ADD, that_col, null
        ))
      }
    })

    // 考虑 this 相较于 that 是否还有多余的列
    this.data_columns.forEach((this_col, col_name) => {
      // 如果处理过了，pass
      if (this_col_used.indexOf(col_name) >= 0) {
        return;
      }
      // 如果 this(src) 存在 that(tar) 不存在的 column，删除
      cols_have_diff.push(new Difference<DataColumn>(
        DifferenceType.COL_DROP, null, this_col
      ));
    })
    return cols_have_diff;
  }

  public transform(differences: Array<Difference<DataColumn>>): Array<String> {
    let trans_ddl: Array<String> = [];
    differences.forEach(diff => {
      switch (diff.type) {
        case DifferenceType.COL_ADD:
          trans_ddl.push(`ALTER TABLE \`${this.table_name}\` ADD COLUMN ${(diff.tar as DataColumn).serialize()};`);
          break;
        case DifferenceType.COL_DROP:
          trans_ddl.push(`ALTER TABLE \`${this.table_name}\` DROP COLUMN \`${(diff.src as DataColumn).col_name}\`;`);
          break;
        case DifferenceType.COL_MODIFY:
          trans_ddl.push(`ALTER TABLE \`${this.table_name}\` MODIFY COLUMN ${(diff.tar as DataColumn).serialize()};`);
          break;
        default:
          break;
      }
    });
    return trans_ddl;
  }
}


export class DataColumn extends TableElement implements Equaler<DataColumn>, Serializer {
  col_name: String;
  col_data_type: String;

  col_options: DataColumnOptions;

  constructor(col_name: String, col_data_type: String, col_options: DataColumnOptions) {
    super();
    this.col_name = col_name;
    this.col_data_type = col_data_type;
    this.col_options = col_options;
  }

  public equal(that: DataColumn): boolean {
    const settings = table.column;
    return (
      (!settings.name || settings.name && (this.col_name == that.col_name))
      && (!settings.data_type || settings.data_type && (this.col_data_type == that.col_data_type))
      && (!settings.data_options || settings.data_options && this.col_options.equal(that.col_options))
    );
  }

  public serialize(): string {
    return `\`${this.col_name}\` ${this.col_data_type} ${this.col_options.serialize()}`.trim();
  }
}


export class DataColumnOptions implements Equaler<DataColumnOptions>, Serializer {
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

  /**
   * equal is to implement interface Equaler
   */
  public equal(that: DataColumnOptions): boolean {
    const settings = table.column.data_options;
    return (
      (!settings.auto_increment || settings.auto_increment && (this.auto_increment == that.auto_increment))
      && (!settings.collate || settings.collate && (this.collate == that.collate))
      && (!settings.comment || settings.comment && (this.comment == that.comment))
      && (!settings.default_val || settings.default_val && (this.default_val == that.default_val))
      && (!settings.not_null || settings.not_null && (this.not_null == that.not_null))
      && (!settings.storage || settings.storage && (this.storage == that.storage))
      && (!settings.visible || settings.visible && (this.visible == that.visible))
    );
  }

  public serialize(): string {
    let res = "";
    res += this.collate == "" ? "" : ` COLLATE ${this.collate} `;
    res += this.not_null ? " NOT NULL " : "";
    res += this.storage == StorageType.EMPTY ? "" : ` /*!50606 STORAGE ${this.storage} */ `;
    res += this.default_val == null ? "" : ` DEFAULT ${this.default_val} `;
    res += this.visible ? "" : " /*!80023 INVISIBLE */ ";
    res += this.auto_increment ? " AUTO_INCREMENT " : "";
    res += ` COMMENT '${this.comment}' `;
    return res.trim();
  }
}
