const up = [
    {
        "targetTable": "inventory",
        "type": "changeColumn",
        "query": "ALTER TABLE `DATABASE-NAME`.`inventory` MODIFY `name` VARCHAR(40) NOT NULL,\n    ADD UNIQUE INDEX `unique_index_name` (`name`)\n  ;",
        "ddl": "CREATE TABLE `inventory` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(40) NOT NULL,\n  `type` varchar(20) NOT NULL,\n  `description` text DEFAULT NULL,\n  PRIMARY KEY (`id`),\n  UNIQUE KEY `unique_item_name` (`name`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    },
    {
        "targetTable": "user",
        "type": "changeColumn",
        "query": "ALTER TABLE `DATABASE-NAME`.`user` MODIFY `name` VARCHAR(40) NOT NULL\n    \n  ;",
        "ddl": "CREATE TABLE `user` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(40) NOT NULL,\n  `create_at` datetime DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    },
    {
        "targetTable": "user",
        "type": "addColumn",
        "query": "ALTER TABLE `DATABASE-NAME`.`user` ADD COLUMN `create_at` DATETIME NULL;",
        "ddl": "CREATE TABLE `user` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(40) NOT NULL,\n  `create_at` datetime DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    }
]

export default up;