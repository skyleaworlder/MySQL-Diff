-- write
CREATE TABLE `test_datacolumn` (
    `id` INT NOT NULL PRIMARY STORAGE MEMORY,
    `c_id` INT NOT NULL STORAGE DISK COLLATE `utf8mb4_general_ci`,
    `name` VARCHAR(62) NOT NULL DEFAULT "" UNIQUE INVISIBLE,
);