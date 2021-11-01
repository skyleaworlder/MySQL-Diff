# :dolphin: MySQL-Diff

（作为 :child: 第一个能跑的 `*.ts` 程序，算是对 `TypeScript` 基础语法和 `Node` 的一次简单了解。）

## Installation

```shell
> git clone https://github.com/skyleaworlder/MySQL-Diff
> cd MySQL-Diff
> npm install
```

## Usage

### 1. Using CLI

对于以下的两个 `SQL-Table-DDL`，明显是存在相当差异，但又有很多相似部分的。

```sql
-- source.sql
CREATE TABLE `test_constraint` (
  `c1` int DEFAULT NULL,
  `c2` int DEFAULT NULL,
  `c3` int DEFAULT NULL,
  `c_id` int NOT NULL COMMENT 'c_id',
  `d_id` int NOT NULL,
  CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),
  CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `test_constraint_chk_4` CHECK ((`c1` > `c3`)),
  CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`, `d_id`) REFERENCES `test_datacolumn` (`c_id`, `id`) ON DELETE CASCADE
);
```

```sql
-- target.sql
CREATE TABLE `test_constraint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `c1` int DEFAULT NULL,
  `c2` int DEFAULT NULL,
  `c3` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),
  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),
  CONSTRAINT `test_constraint_chk_1` CHECK ((`c1` > 10)),
  CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),
  CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `test_constraint_chk_4` CHECK ((`c1` > `c3`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

可以直接输入这两个文件的路径：

```shell
> # e.g. npm run cli test/sql/source.sql test/sql/target.sql
> npm run cli [Your-Source-Table-DDL-Path] [Your-Target-Table-DDL-Path]
>
> # result
> [
>  "ALTER TABLE `test_constraint` ADD COLUMN `id` int NOT NULL COMMENT '';",
>  'ALTER TABLE `test_constraint` DROP COLUMN `c_id`;',
>  'ALTER TABLE `test_constraint` DROP COLUMN `d_id`;',
>  "ALTER TABLE `test_constraint` ADD PRIMARY KEY (`id`) COMMENT '';",
>  'ALTER TABLE `test_constraint` ADD CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0));',
>  'ALTER TABLE `test_constraint` ADD CONSTRAINT `c2_positive` CHECK ((`c2` > 0));',
>  'ALTER TABLE `test_constraint` ADD CONSTRAINT `test_constraint_chk_1` CHECK ((`c1` > 10));',
>  'ALTER TABLE `test_constraint` DROP CONSTRAINT `test_index_ibfk_1`;'
> ]
```

## Feature

### 1. mysql-diff-settings.json

可以在这个配置文件中配置 “需要比较” 的项。如果我并不想考虑数据项 `comment` 的差异，那么只需要在对应设置中置为 `false`：

```json
{
  "table": {
    "column": {
      "data_options": {
        // balabala
        "comment": false
        // balabala
      }
    }
  }
}
```

这样 `MySQL-Diff` 就不会比较那个属性的差异，诸如此类，还可以对 `UNIQUE KEY` 的名字、`CONSTRAINT` 的触发条件等属性进行设置。

### 2. 使用了 RENAME

在比较 `Key` 差异时，`MySQL-Diff` 会观察到 “命名可能错误” 的情况，并建议纠正：

```sql
-- source
CREATE TABLE `test_keys` (
  `c_id` int NOT NULL COMMENT 'c_id',
  `name` varchar(62) NOT NULL DEFAULT '',
  `d_id` int NOT NULL,
  UNIQUE KEY `c_id` (`c_id`,`d_id`),
);
```

```sql
-- target
CREATE TABLE `test_keys` (
  `c_id` int NOT NULL AUTO_INCREMENT COMMENT 'c_id',
  `id` int NOT NULL,
  `d_id` int NOT NULL,
  KEY `uk_c_id_d_id` (`c_id`,`d_id`),
);
```

`MySQL-Diff` 会敏锐地发现 `c_id` 可能命名错误，它可能应该叫 `uk_c_id_d_id` 的。`MySQL-Diff` 会聪明地给出 `ALTER TABLE test_keys RENAME KEY c_id TO uk_c_id_d_id;`，而非先删后增。

但除此之外就没什么特色了。

## Withdrew

### 1. 只能用 SHOW CREATE TABLE 的结果作为输入

如题，我没有按照一般 `SQL` 语法解析它，只是写了个针对 `MySQL 8.0` 的 `SHOW CREATE TABLE` 输出的 `MySQL-Diff`。

### 2. PRIMARY KEY 非常不智能

可能出现给不存在的字段添加 `pk` 或给非 `AUTO_INCREMENT` 字段增加 `pk` 的问题。

纯属设计问题。

### 3. 暂时不能同时比较多个表

（不想写了）

## History

两周前被分配了这样一个需求——肉眼看线上线下数据库差异，并将线下数据库向线上对齐。

那一天，我写了 55 条 `ALTER TABLE`……
