# DDL

## 1. CREATE TABLE

[About Table](https://dev.mysql.com/doc/refman/8.0/en/create-table.html)

### i. COLUMN

```sql
CREATE TABLE `Persons`
(
    `PersonID` int NOT NULL AUTO_INCREMENT,
    `HashID` int NOT NULL DEFAULT 0,
    `LastName` varchar(255),
    `FirstName` varchar(255),
    `Address` varchar(255),
    `City` varchar(255)
);
```

* Column Name
* Column Data Type
* Column Options

### ii. INDEX | KEY

```sql
CREATE TABLE Persons
(
    -- like above
    UNIQUE KEY `id_last_name` (`PersonID`, `LastName`) USING BTREE,
    FOREIGN KEY `HashID` REFERENCES `Hash` (`HashID`)
);
```

* Index Type
* Index Name
* Index Options (Polymorphism)

### iii. CONSTRAINT

```sql
CREATE TABLE Persons
(
    -- like above
    CONSTRAINT `ck_id` CHECK (`PersonID` > 0)
);
```

* Constraint Name
* Constraint Condition

### iv. TABLE OPTIONS

Other Options Like "ENGINE", "CHARACTER SET"...
