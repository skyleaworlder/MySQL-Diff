-- write
CREATE TABLE `test_index` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `c_id` INT NOT NULL,
    `name` VARCHAR(62) NOT NULL DEFAULT "" UNIQUE,
    FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE
);

-- show create table
CREATE TABLE `test_index` (
  `id` int NOT NULL AUTO_INCREMENT,
  `c_id` int NOT NULL,
  `name` varchar(62) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `c_id` (`c_id`),
  CONSTRAINT `test_index_ibfk_1` FOREIGN KEY (`c_id`) REFERENCES `test_constraint` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;