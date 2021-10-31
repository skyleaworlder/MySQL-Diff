import { processDDL, processTable } from "@/lexer/Processor"

test('process a table', () => {
  let test_case = [
    {input: [
      'CREATE TABLE `test_constraint` (',
      '  `id` int NOT NULL AUTO_INCREMENT,',
      '  `c1` int DEFAULT NULL,',
      '  `c2` int DEFAULT NULL,',
      '  `c3` int DEFAULT NULL,',
      '  PRIMARY KEY (`id`),',
      '  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),',
      '  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),',
      '  CONSTRAINT `test_constraint_chk_1` CHECK ((`c1` > 10)),',
      '  CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),',
      '  CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),',
      '  CONSTRAINT `test_constraint_chk_4` CHECK ((`c1` > `c3`))',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
    ]},
    {input: [
      'CREATE TABLE `test_datacolumn` (',
      "  `id` int NOT NULL /*!50606 STORAGE MEMORY */ AUTO_INCREMENT /*!80023 INVISIBLE */ COMMENT 'id',",
      "  `c_id` int NOT NULL /*!50606 STORAGE DISK */ COMMENT 'c_id',",
      "  `name` varchar(62) NOT NULL DEFAULT '' /*!80023 INVISIBLE */,",
      '  PRIMARY KEY (`id`),',
      '  UNIQUE KEY `name` (`name`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
    ]},
    {input: [
      'CREATE TABLE `test_index` (',
      '  `id` int NOT NULL AUTO_INCREMENT,',
      "  `c_id` int NOT NULL COMMENT 'c_id',",
      "  `name` varchar(62) NOT NULL DEFAULT '',",
      '  `k_id` int NOT NULL,',
      '  PRIMARY KEY (`id`),',
      '  UNIQUE KEY `name` (`name`),',
      '  UNIQUE KEY `c_id` (`c_id`,`k_id`),',
      '  CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
    ]}
  ]
  test_case.forEach(t_case => {
    console.log(processTable(t_case.input));
  })
})


test('process a ddl file', () => {
  let input = [
    'CREATE TABLE `test_datacolumn` (',
    "    `id` INT NOT NULL AUTO_INCREMENT STORAGE MEMORY INVISIBLE COMMENT 'id',",
    "    `c_id` INT  NOT NULL  STORAGE DISK COLLATE `utf8mb4_general_ci` COMMENT 'c_id',",
    '    `name` VARCHAR(62) NOT NULL DEFAULT "" UNIQUE INVISIBLE,',
    ');',
    'CREATE TABLE `test_constraint` (',
    '  `id` int NOT NULL AUTO_INCREMENT,',
    '  `c1` int DEFAULT NULL,',
    '  `c2` int DEFAULT NULL,',
    '  `c3` int DEFAULT NULL,',
    '  PRIMARY KEY (`id`),',
    '  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),',
    '  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),',
    '  CONSTRAINT `test_constraint_chk_1` CHECK ((`c1` > 10)),',
    '  CONSTRAINT `test_constraint_chk_2` CHECK ((`c3` < 100)),',
    '  CONSTRAINT `test_constraint_chk_3` CHECK ((`c1` <> `c2`)),',
    '  CONSTRAINT `test_constraint_chk_4` CHECK ((`c1` > `c3`))',
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;',
    'CREATE TABLE `test_index` (',
    '  `id` int NOT NULL AUTO_INCREMENT,',
    "  `c_id` int NOT NULL COMMENT 'c_id',",
    "  `name` varchar(62) NOT NULL DEFAULT '',",
    '  `k_id` int NOT NULL,',
    '  PRIMARY KEY (`id`),',
    '  UNIQUE KEY `name` (`name`),',
    '  UNIQUE KEY `c_id` (`c_id`,`k_id`),',
    '  CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE',
    ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
  ]
  let ddl = processDDL(input);
  console.log(ddl);
})
