-- write
CREATE TABLE `test_constraint` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `c1` INT CHECK (`c1` > 10),
  `c2` INT CONSTRAINT `c2_positive` CHECK (`c2` > 0),
  `c3` INT CHECK (`c3` < 100),
  CONSTRAINT `c1_nonzero` CHECK (`c1` <> 0),
  CHECK (`c1` <> `c2`),
  CHECK (`c1` > `c3`)
);

-- show create table `test_constraint`
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