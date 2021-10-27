
/**
 * ConstraintType 总共分成两种：
 * 1. Check Constraint，后面只跟多个 condition；
 * 2. Foreign Key Constraint，类似定义键一样的 attributes。
 */
export enum ConstraintType {
  CHECK_CONSTRAINT = "CHECK",
  FOREIGN_KEY_CONSTRAINT = "FOREIGN KEY"
}


/**
 * ReferenceOption 是 Reference 中跟在 ON [Action] 之后的谓词
 */
export enum ReferenceOption {
  EMPTY = "",
  RESTRICT = "RESTRICT",
  CASCADE = "CASCADE",
  SET_NULL = "SET NULL",
  NO_ACTION = "NO ACTION",
  SET_DEFAULT = "SET DEFAULT"
}


/**
 * ReferenceAction 是 Reference 中跟在 ON 后面的谓词
 */
export enum ReferenceAction {
  EMPTY = "",
  DELETE = "DELETE",
  UPDATE = "UPDATE"
}


/**
 * StorageType 是 data column 的存储类别
 */
export enum StorageType {
  EMPTY = "",
  MEMROY = "MEMORY",
  DISK = "DISK"
}


/**
 * KeyType 是键的类别，分为 PRIMARY UNIQUE 和普通 KEY。
 */
export enum KeyType {
  PRIMARY_KEY = "PRIMARY KEY",
  UNIQUE_KEY = "UNIQUE KEY",
  NORMAL_KEY = "KEY"
}


/**
 * IndexDS 是 index 的数据结构，分为 btree 和 hash
 */
export enum IndexDS {
  BTREE = "BTREE",
  HASH = "HASH"
}
