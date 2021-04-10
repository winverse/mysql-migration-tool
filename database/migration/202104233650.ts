const up = [
    {
        "targetTable": "inventory",
        "type": "dropTable",
        "query": "DROP TABLE `DATABASE-NAME`.`inventory`",
        "ddl": ""
    },
    {
        "targetTable": "user",
        "type": "dropTable",
        "query": "DROP TABLE `DATABASE-NAME`.`user`",
        "ddl": ""
    },
    {
        "targetTable": "meta",
        "type": "changeColumn",
        "query": "ALTER TABLE `DATABASE-NAME`.`meta` MODIFY `name` VARCHAR(20) NOT NULL,\n    \n  ;",
        "ddl": "CREATE TABLE `meta` (\n  `id` int(11) NOT NULL AUTO_INCREMENT,\n  `name` varchar(20) NOT NULL,\n  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    }
];

export default up;