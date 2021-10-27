import { KeyType, IndexDS } from "@/model/Enum";

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


export class UniqueKey extends BaseKey {
  key_name: String;

  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.UNIQUE_KEY, key_part, index_ds, key_options);
    this.key_name = key_name;
  }
}


export class NormalKey extends BaseKey {
  key_name: String;

  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.NORMAL_KEY, key_part, index_ds, key_options);
    this.key_name = key_name;
  }
}

export class KeyOptions {
  comment: String;

  constructor(comment: String = "") {
    this.comment = comment;
  }
}
