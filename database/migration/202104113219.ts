const up = [
    {
        "targetTable": "meta",
        "type": "createTable",
        "query": "CREATE TABLE IF NOT EXISTS `DATABASE-NAME`.`meta` (\n  `id` INT(11) NOT NULL AUTO_INCREMENT,\n  `name` VARCHAR(20) NOT NULL,\n  `create_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),\n  PRIMARY KEY(`id`)\n)",
        "ddl": "CREATE TABLE `meta` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(20) NOT NULL,\n  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4"
    },
    {
        "targetTable": "user",
        "type": "createTable",
        "query": "CREATE TABLE IF NOT EXISTS `DATABASE-NAME`.`user` (\n  `id` INT(11) NOT NULL AUTO_INCREMENT,\n  `name` VARCHAR(20) NULL,\n  PRIMARY KEY(`id`)\n)",
        "ddl": "CREATE TABLE `user` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(20) DEFAULT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    }
];

export default up;