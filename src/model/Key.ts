import { KeyType, IndexDS } from "@/model/Enum";
import { Appender } from "@/model/Common";

export class Keys implements Appender<BaseKey> {
  keys: Map<String, BaseKey>;

  constructor() {
    this.keys = new Map<String, BaseKey>();
  }

  /**
   * append
   */
  public append(elem: BaseKey): void {
    if (elem.key_type == KeyType.PRIMARY_KEY) {
      this.keys.set(elem.key_type, elem);
      return
    }
    this.keys.set((elem as NonPrimaryKey).key_name, elem);
  }
}

export class BaseKey {
  key_type: KeyType;
  key_part: Array<String>;
  index_ds: IndexDS;
  key_options: KeyOptions;

  constructor(key_type: KeyType, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    this.key_type = key_type;
    this.key_part = key_part;
    this.index_ds = index_ds;
    this.key_options = key_options;
  }
}


export class PrimaryKey extends BaseKey {
  constructor(key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.PRIMARY_KEY, key_part, index_ds, key_options);
  }
}


export class NonPrimaryKey extends BaseKey {
  key_name: String;

  constructor(key_type: KeyType, key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(key_type, key_part, index_ds, key_options);
    this.key_name = key_name;
  }
}


export class UniqueKey extends NonPrimaryKey {
  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.UNIQUE_KEY, key_name, key_part, index_ds, key_options);
  }
}


export class NormalKey extends NonPrimaryKey {
  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.NORMAL_KEY, key_name, key_part, index_ds, key_options);
  }
}

export class KeyOptions {
  comment: String;

  constructor(comment: String = "") {
    this.comment = comment;
  }
}
