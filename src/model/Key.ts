import { KeyType, IndexDS, DifferenceType } from "@/model/Enum";
import { Appender, Comparer, Equaler, Serializer, Transformer, TableContext, TableElement } from "@/model/Common";
import { table } from "../../mysql-diff-settings.json";
import { equalArray, equalStringArrayStrict } from "@/util/Common";
import { Difference } from "@/model/Difference";
import { composeKeyPart, composePrimaryKeyName } from "@/util/Key";

export class Keys extends TableContext implements Appender<BaseKey>, Comparer<Keys, BaseKey>, Transformer<BaseKey> {
  keys: Map<String, BaseKey>;

  constructor(table_name: String) {
    super(table_name);
    this.keys = new Map<String, BaseKey>();
  }

  /**
   * append
   */
  public append(elem: BaseKey): void {
    if (elem.key_type == KeyType.PRIMARY_KEY) {
      this.keys.set(composePrimaryKeyName(elem), elem);
      return
    }
    this.keys.set((elem as NonPrimaryKey).key_name, elem);
  }

  /**
   * compareTo is to implement interface Comparer
   * @param that 另外一个 Keys instance
   * @returns 两个 Keys 的差异
   */
  public compareTo(that: Keys): Array<Difference<BaseKey>> {
    let keys_have_diff: Array<Difference<BaseKey>> = [];
    let this_key_used: Array<String> = [];
    let that_key_used: Array<String> = [];

    // 需要注意的是，PRIMARY KEY 没有 name，这里用 f"PRIMARY KEY {key_part[0]}" 代替
    that.keys.forEach((that_key, key_name) => {
      // PRIMARY KEY MODIFY 是极其特殊的情况，先处理主键
      if (key_name.startsWith("PRIMARY KEY ")) {
        const this_pk: PrimaryKey | null = this.fetchPrimaryKey();
        if (this_pk != null && !this_pk.equal(that_key)) {
          const this_pk_name = composePrimaryKeyName(this_pk);
          this_key_used.push(this_pk_name);
          that_key_used.push(key_name);
          keys_have_diff.push(new Difference<BaseKey>(
            DifferenceType.PK_MODIFY, that_key, this.keys.get(this_pk_name) as BaseKey
          ));
          return;
        }
      }

      // this(src) 中存在和 that(tar) 同名的 constraint
      if (this.keys.has(key_name)) {
        this_key_used.push(key_name);
        that_key_used.push(key_name);
        const this_key = this.keys.get(key_name);
        // UNIQUE KEY / NORMAL KEY 的 MODIFY
        if ((this_key as NonPrimaryKey).equal(that_key as NonPrimaryKey)) {
          return;
        } else {
          keys_have_diff.push(new Difference<BaseKey>(
            DifferenceType.KEY_MODIFY, that_key, this_key as BaseKey
          ));
        }
      }
    })

    that.keys.forEach((that_key, key_name) => {
      // 这里不欢迎 PRIMARY KEY
      if (that_key.key_type == KeyType.PRIMARY_KEY || that_key_used.indexOf(key_name) >= 0) {
        return;
      }
      let key_with_same_type_part = Keys.findKeyWithSameTypeAndPart(that_key as NonPrimaryKey, this, this_key_used);
      if (key_with_same_type_part == null) {
        return;
      }
      this_key_used.push(key_with_same_type_part.key_name);
      that_key_used.push(key_name);
      // UNIQUE KEY / NORMAL KEY 的 RENAME
      keys_have_diff.push(new Difference<BaseKey>(
        DifferenceType.KEY_RENAME, that_key, key_with_same_type_part as BaseKey
      ));
    })

    that.keys.forEach((that_key, key_name) => {
      if (that_key_used.indexOf(key_name) >= 0) {
        return;
      }
      // PRIMARY KEY / UNIQUE KEY / NORMAL KEY 的 ADD
      keys_have_diff.push(new Difference<BaseKey>(DifferenceType.KEY_ADD, that_key, null));
    })

    this.keys.forEach((this_key, key_name) => {
      if (this_key_used.indexOf(key_name) >= 0) {
        return;
      }
      // PRIMARY KEY / UNIQUE KEY / NORMAL KEY 的 DROP
      keys_have_diff.push(new Difference<BaseKey>(DifferenceType.KEY_DROP, null, this_key));
    })
    return keys_have_diff;
  }

  public transform(differences: Array<Difference<BaseKey>>): Array<String> {
    let trans_ddl: Array<String> = [];
    differences.forEach(diff => {
      switch (diff.type) {
        case DifferenceType.KEY_ADD:
          trans_ddl.push(`ALTER TABLE \`${this.table_name}\` ADD ${diff.tar?.serialize()};`);
          break;
        case DifferenceType.KEY_DROP:
          if ((diff.src as BaseKey).key_type == KeyType.PRIMARY_KEY) {
            trans_ddl.push(`ALTER TABLE \`${this.table_name}\` DROP ${KeyType.PRIMARY_KEY};`);
          } else {
            trans_ddl.push(`ALTER TABLE \`${this.table_name}\` DROP \`${(diff.src as NonPrimaryKey).key_name}\`;`)
          }
          break;
        case DifferenceType.KEY_MODIFY:
          trans_ddl.push(
            `ALTER TABLE \`${this.table_name}\` DROP KEY \`${(diff.src as NonPrimaryKey).key_name}\`,`
            + ` ADD ${(diff.tar as NonPrimaryKey).serialize()};`
          );
          break;
        case DifferenceType.KEY_RENAME:
          trans_ddl.push(
            `ALTER TABLE \`${this.table_name}\` RENAME KEY \`${(diff.src as NonPrimaryKey).key_name}\``
            + ` TO \`${(diff.tar as NonPrimaryKey).key_name}\`;`
          );
          break;
        case DifferenceType.PK_MODIFY:
          trans_ddl.push(`ALTER TABLE \`${this.table_name}\` DROP ${KeyType.PRIMARY_KEY}, ADD ${(diff.tar as PrimaryKey).serialize()};`);
          break;
        default:
          break;
      }
    })
    return trans_ddl;
  }

  /**
   * findKeyWithSameTypeAndPart
   * @param to_find 想要在 keys 查找的 NonPrimaryKey
   * @param keys 查找范围
   * @param ignored_keys 给出忽略的 key 的名字
   * @returns 返回 null 代表没找到，返回实例代表 “返回了 keys 中相同 type 和 part 的那个 key”
   */
  private static findKeyWithSameTypeAndPart(to_find: NonPrimaryKey, keys: Keys, ignored_keys: Array<String>): NonPrimaryKey | null {
    let ret: BaseKey | null = null;
    keys.keys.forEach((that_key, key_name) => {
      if (ignored_keys.indexOf(key_name) >= 0 || !to_find.type_part_equal(that_key)) {
        return;
      }
      ret = that_key;
    })
    return ret;
  }

  /**
   * 获取该类中 keys 成员中的主键 PrimaryKey
   * @returns keys 中的主键
   */
  private fetchPrimaryKey(): PrimaryKey | null {
    let ret: PrimaryKey | null = null;
    this.keys.forEach((key, key_name) => {
      if (key_name.startsWith(KeyType.PRIMARY_KEY + " ")) {
        ret = key;
      }
    })
    return ret;
  }
}

export abstract class BaseKey extends TableElement implements Equaler<BaseKey>, Serializer {
  key_type: KeyType;
  key_part: Array<String>;
  index_ds: IndexDS;
  key_options: KeyOptions;

  constructor(key_type: KeyType, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super();
    this.key_type = key_type;
    this.key_part = key_part;
    this.index_ds = index_ds;
    this.key_options = key_options;
  }

  public type_part_equal(that: BaseKey): boolean {
    const settings = table.key;
    return (
      (!settings.type || settings.type && (this.key_type == that.key_type))
      && (!settings.part || settings.part && equalStringArrayStrict(this.key_part, that.key_part))
    )
  }

  public abstract equal(that: BaseKey): boolean;

  public abstract serialize(): string;
}


export class PrimaryKey extends BaseKey implements Equaler<PrimaryKey>, Serializer {
  constructor(key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.PRIMARY_KEY, key_part, index_ds, key_options);
  }

  public equal(that: PrimaryKey): boolean {
    const settings = table.key;
    return (
      this.type_part_equal(that)
      && (!settings.index_ds || settings.index_ds && (this.index_ds == that.index_ds))
      && (!settings.options || settings.options && this.key_options.equal(that.key_options))
    )
  }

  public serialize(): string {
    return `PRIMARY KEY (${composeKeyPart(this.key_part)}) ${this.key_options.serialize()}`;
  }
}


export class NonPrimaryKey extends BaseKey implements Equaler<NonPrimaryKey>, Serializer {
  key_name: String;

  constructor(key_type: KeyType, key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(key_type, key_part, index_ds, key_options);
    this.key_name = key_name;
  }

  public equal(that: NonPrimaryKey): boolean {
    const settings = table.key;
    const nk_settings = table.key.non_primary_key;
    return (
      this.type_part_equal(that)
      && (!settings.index_ds || settings.index_ds && (this.index_ds == that.index_ds))
      && (!settings.options || settings.options && this.key_options.equal(that.key_options))
      && (!nk_settings.name || nk_settings.name && this.key_name == that.key_name)
    )
  }

  public serialize(): string {
    return `KEY \`${this.key_name}\` (${composeKeyPart(this.key_part)}) ${this.key_options.serialize()}`;
  }
}


export class UniqueKey extends NonPrimaryKey implements Serializer {
  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.UNIQUE_KEY, key_name, key_part, index_ds, key_options);
  }

  public serialize(): string {
    return `UNIQUE ${super.serialize()}`;
  }
}


export class NormalKey extends NonPrimaryKey {
  constructor(key_name: String, key_part: Array<String>, index_ds = IndexDS.BTREE, key_options: KeyOptions) {
    super(KeyType.NORMAL_KEY, key_name, key_part, index_ds, key_options);
  }
}

export class KeyOptions implements Equaler<KeyOptions>, Serializer {
  comment: String;

  constructor(comment: String = "") {
    this.comment = comment;
  }

  public equal(that: KeyOptions): boolean {
    const settings = table.key.options;
    return (
      (!settings.comment || settings.comment && this.comment == that.comment)
    );
  }

  public serialize(): string {
    return `COMMENT '${this.comment}'`;
  }
}
