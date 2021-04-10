const up = [
    {
        "targetTable": "inventory",
        "type": "createTable",
        "query": "CREATE TABLE IF NOT EXISTS `DATABASE-NAME`.`inventory` (\n  `id` INT(11) NOT NULL AUTO_INCREMENT,\n  `name` VARCHAR(20) NOT NULL,\n  `type` VARCHAR(20) NOT NULL,\n  `description` TEXT NULL,\n  PRIMARY KEY(`id`)\n)",
        "ddl": "CREATE TABLE `inventory` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(20) NOT NULL,\n  `type` varchar(20) NOT NULL,\n  `description` text DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    }
];

export default up;