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
    PRIMARY KEY `PersonID`,
    UNIQUE KEY `id_last_name` (`PersonID`, `LastName`) USING BTREE,
    KEY `HashID`
);
```

All Index or Keys are below Data Column Definitions.

* Index Type: PRIMARY / UNIQUE / KEY
* Index Name
* Index Options (Polymorphism)

### iii. CONSTRAINT

```sql
CREATE TABLE Persons
(
    -- like above
    CONSTRAINT `ck_id` CHECK (`PersonID` > 0),
    CONSTRAINT `Persons_ibfk_1` FOREIGN KEY (`HashID`) REFERENCES `Hash` (`id`) ON DELETE CASCADE
);
```

All Constraints are below Data Column Definitions: Check-Constraint and Foreign-Key-Constraint.

* Constraint Name
* Constraint Condition

### iv. TABLE OPTIONS (ABANDON)

Other Options Like "ENGINE", "CHARACTER SET"...

## 2. Differ

Now I have 2 Table/Trigger/View(s).

## 3. ALTER

### i. ALTER TABLE

Firstly, Table Name is Needed Anyway.

#### a. COLUMN

#### b. KEY

#### c. CONSTRAINT