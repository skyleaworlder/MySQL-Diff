-- write
CREATE TABLE `test_datacolumn` (
    `id` INT NOT NULL AUTO_INCREMENT STORAGE MEMORY INVISIBLE COMMENT 'id',
    `c_id` INT  NOT NULL  STORAGE DISK COLLATE `utf8mb4_general_ci` COMMENT 'c_id',
    `name` VARCHAR(62) NOT NULL DEFAULT "" UNIQUE INVISIBLE,
);

-- show create table
CREATE TABLE `test_datacolumn` (
  `id` int NOT NULL /*!50606 STORAGE MEMORY */ AUTO_INCREMENT /*!80023 INVISIBLE */ COMMENT 'id',
  `c_id` int NOT NULL /*!50606 STORAGE DISK */ COMMENT 'c_id',
  `name` varchar(62) NOT NULL DEFAULT '' /*!80023 INVISIBLE */,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;